import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ForestPack, PlayerSession, Riddle, PlayerFeedback, DuelMatch, DuelTeam, DuelEvent, DuelEffect } from './src/types';
import { SEED_FOREST_PACKS } from './src/data/seedPacks';
import { findBestRiddle } from './src/utils/difficultyFallback';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK if key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// Data Persistence Layer (File-backed JSON storage in /data)
// -------------------------------------------------------------
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const FORESTS_FILE = path.join(DATA_DIR, 'forests.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const I18N_FILE = path.join(__dirname, 'src', 'data', 'i18n.json');

function loadI18n(): any {
  try {
    if (fs.existsSync(I18N_FILE)) {
      return JSON.parse(fs.readFileSync(I18N_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { ui: {}, keys: {} };
}

function translateServer(key: string, lang: string = 'es', fallback: string = ''): string {
  const i18n = loadI18n();
  return (
    i18n.ui?.[lang]?.[key] ||
    i18n.keys?.[key]?.[lang] ||
    i18n.ui?.[lang.toLowerCase()]?.[key] ||
    i18n.keys?.[key]?.[lang.toLowerCase()] ||
    i18n.ui?.['es']?.[key] ||
    i18n.keys?.[key]?.['es'] ||
    fallback ||
    key
  );
}

function loadForests(): ForestPack[] {
  try {
    if (fs.existsSync(FORESTS_FILE)) {
      const data = fs.readFileSync(FORESTS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading forests.json, using seed packs:', err);
  }
  // Initialize with seed packs
  saveForests(SEED_FOREST_PACKS);
  return SEED_FOREST_PACKS;
}

function saveForests(forests: ForestPack[]): void {
  try {
    fs.writeFileSync(FORESTS_FILE, JSON.stringify(forests, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving forests.json:', err);
  }
}

function loadSessions(): Record<string, PlayerSession> {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading sessions.json:', err);
  }
  return {};
}

function saveSessions(sessions: Record<string, PlayerSession>): void {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving sessions.json:', err);
  }
}

function loadFeedback(): PlayerFeedback[] {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      const data = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading feedback.json:', err);
  }
  return [];
}

function saveFeedback(feedbackList: PlayerFeedback[]): void {
  try {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbackList, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving feedback.json:', err);
  }
}

const DUELS_FILE = path.join(DATA_DIR, 'duels.json');

function loadDuels(): Record<string, DuelMatch> {
  try {
    if (fs.existsSync(DUELS_FILE)) {
      const data = fs.readFileSync(DUELS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading duels.json:', err);
  }
  return {};
}

function saveDuels(duels: Record<string, DuelMatch>): void {
  try {
    fs.writeFileSync(DUELS_FILE, JSON.stringify(duels, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving duels.json:', err);
  }
}

// In-memory cache loaded from disk
let forestPacks: ForestPack[] = loadForests();
let sessions: Record<string, PlayerSession> = loadSessions();
let feedbackList: PlayerFeedback[] = loadFeedback();
let duelMatches: Record<string, DuelMatch> = loadDuels();

// Duel WebSocket connections tracking
const duelWss = new WebSocketServer({ noServer: true });
const duelClients = new Map<string, Set<{ ws: WebSocket; teamId: string }>>();

function broadcastDuel(matchCode: string, payload: any) {
  const clients = duelClients.get(matchCode);
  if (!clients) return;
  const msg = JSON.stringify(payload);
  for (const client of clients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(msg);
    }
  }
}

// Bot rival AI runner for solo duel exploration
function startShadowRivalBot(matchCode: string) {
  const match = duelMatches[matchCode];
  if (!match) return;
  const botTeam = match.teams.find((t) => t.isBot);
  if (!botTeam) return;

  const pack = forestPacks.find((p) => p.id === match.forestPackId) || forestPacks[0];
  const poiIds = pack.pois.map((p) => p.id);

  const botInterval = setInterval(() => {
    const currentM = duelMatches[matchCode];
    if (!currentM || currentM.status === 'finished') {
      clearInterval(botInterval);
      return;
    }
    const bTeam = currentM.teams.find((t) => t.id === botTeam.id);
    if (!bTeam) {
      clearInterval(botInterval);
      return;
    }

    const targetPoiId = poiIds[bTeam.currentPoiIndex] || poiIds[0];
    const targetPoi = pack.pois.find((p) => p.id === targetPoiId) || pack.pois[0];

    // Move slightly towards target POI
    bTeam.lat = bTeam.lat + (targetPoi.lat - bTeam.lat) * 0.25;
    bTeam.lng = bTeam.lng + (targetPoi.lng - bTeam.lng) * 0.25;
    bTeam.lastActive = new Date().toISOString();

    // Plausible solving progression
    if (Math.random() < 0.4 && bTeam.completedPoiIds.length < bTeam.totalPois) {
      if (!bTeam.completedPoiIds.includes(targetPoiId)) {
        bTeam.completedPoiIds.push(targetPoiId);
        bTeam.points += 80;
        bTeam.currentPoiIndex = Math.min(bTeam.currentPoiIndex + 1, bTeam.totalPois - 1);

        const ev: DuelEvent = {
          id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'poi_cleared',
          message: `${bTeam.emblem} ${bTeam.name} ha descubierto el enigma de ${targetPoi.name} (+80 pts)`,
          teamId: bTeam.id,
          teamName: bTeam.name,
          icon: '🦉',
        };
        currentM.events.unshift(ev);
        if (currentM.events.length > 25) currentM.events.pop();

        if (bTeam.completedPoiIds.length >= bTeam.totalPois && !currentM.winnerTeamId) {
          currentM.winnerTeamId = bTeam.id;
          currentM.status = 'finished';
          currentM.events.unshift({
            id: `evt-${Date.now()}-botwin`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'meta_solved',
            message: `👑 ¡${bTeam.emblem} ${bTeam.name} ha completado la senda en primer lugar!`,
            teamId: bTeam.id,
            teamName: bTeam.name,
            icon: '👑',
          });
          clearInterval(botInterval);
        }
      }
    }

    saveDuels(duelMatches);
    broadcastDuel(matchCode, { type: 'duel:update', match: currentM });
  }, 16000);
}

function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»]/g, '')
    .trim();
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bosque2026';

function requireAdmin(req: Request, res: Response, next: Function) {
  // Contraseña de admin desactivada temporalmente a petición del usuario
  return next();
}

// -------------------------------------------------------------
// REST API Endpoints
// -------------------------------------------------------------

// Admin Password Verification (Sin contraseña requerida por el momento)
app.post('/api/admin/verify', (req: Request, res: Response) => {
  return res.json({ success: true, token: 'open-admin' });
});

// 1. Get Forests
app.get('/api/forests', (req: Request, res: Response) => {
  const isAdmin = req.query.admin === 'true';
  const list = isAdmin ? forestPacks : forestPacks.filter(p => p.isPublished !== false);
  res.json(list);
});

// 2. Get Single Forest
app.get('/api/forests/:id', (req: Request, res: Response) => {
  const pack = forestPacks.find(p => p.id === req.params.id);
  if (!pack) {
    return res.status(404).json({ error: 'Bosque no encontrado' });
  }
  res.json(pack);
});

// 3. Create or Update Forest Pack (Admin Only)
app.post('/api/forests', requireAdmin, (req: Request, res: Response) => {
  const packData: ForestPack = req.body;
  if (!packData.name || !packData.centerLat || !packData.centerLng) {
    return res.status(400).json({ error: 'Nombre y coordenadas son requeridos' });
  }

  if (!packData.id) {
    packData.id = packData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Math.floor(Math.random() * 1000);
  }

  const existingIdx = forestPacks.findIndex(p => p.id === packData.id);
  if (existingIdx >= 0) {
    forestPacks[existingIdx] = { ...forestPacks[existingIdx], ...packData };
  } else {
    forestPacks.push(packData);
  }

  saveForests(forestPacks);
  res.json(packData);
});

// 4. Duplicate Forest Pack (Admin Only)
app.post('/api/forests/:id/duplicate', requireAdmin, (req: Request, res: Response) => {
  const source = forestPacks.find(p => p.id === req.params.id);
  if (!source) {
    return res.status(404).json({ error: 'Bosque origen no encontrado' });
  }

  const newId = `${source.id}-copia-${Date.now().toString().slice(-4)}`;
  const duplicate: ForestPack = {
    ...JSON.parse(JSON.stringify(source)),
    id: newId,
    name: `${source.name} (Copia)`,
    isPublished: true,
  };

  forestPacks.push(duplicate);
  saveForests(forestPacks);
  res.json(duplicate);
});

// 5. Delete Forest Pack (Admin Only)
app.delete('/api/forests/:id', requireAdmin, (req: Request, res: Response) => {
  if (forestPacks.length <= 1) {
    return res.status(400).json({ error: 'No se puede eliminar el único bosque disponible.' });
  }
  forestPacks = forestPacks.filter(p => p.id !== req.params.id);
  saveForests(forestPacks);
  res.json({ success: true });
});

// 6. Start / Create Player Session
app.post('/api/sessions', (req: Request, res: Response) => {
  const { forestPackId, name, type, storyId, difficulty, duration, easyMode, language, duelMatchCode, duelTeamId } = req.body;

  const pack = forestPacks.find(p => p.id === forestPackId);
  if (!pack) {
    return res.status(404).json({ error: 'Bosque no encontrado' });
  }

  const story = pack.stories.find(s => s.id === storyId);
  if (!story) {
    return res.status(404).json({ error: 'Historia no encontrada' });
  }

  // Determine route of POIs based on presets
  let routePoiIds: string[] = [];
  if (pack.routePresets && pack.routePresets[storyId] && pack.routePresets[storyId][duration]) {
    routePoiIds = pack.routePresets[storyId][duration];
  } else if (pack.routePresets && Array.isArray(pack.routePresets[storyId])) {
    routePoiIds = pack.routePresets[storyId];
  } else if (pack.routePresets && Array.isArray(pack.routePresets[duration])) {
    routePoiIds = pack.routePresets[duration];
  } else {
    // Only POIs that have riddles for this story
    const storyPois = pack.pois
      .filter(p => pack.riddles.some(r => r.poiId === p.id && r.storyId === storyId))
      .map(p => p.id);
    routePoiIds = storyPois.length > 0 ? storyPois : pack.pois.map(p => p.id);
  }

  // Ensure all POIs in route actually exist
  routePoiIds = routePoiIds.filter(id => pack.pois.some(p => p.id === id));
  if (routePoiIds.length === 0) {
    routePoiIds = pack.pois.map(p => p.id);
  }

  let code = generateSessionCode();
  while (sessions[code]) {
    code = generateSessionCode();
  }

  const sessionLang = language || pack.defaultLanguage || 'es';
  const narratorDisplayName = story.narratorName || story.narrator?.name || (sessionLang === 'fr' ? 'le guide de la forêt' : sessionLang === 'en' ? 'the forest guide' : 'el guía del bosque');

  let welcomeMsg = story.characterGreeting || '';
  if (story.characterGreetingKey) {
    welcomeMsg = translateServer(story.characterGreetingKey, sessionLang, story.characterGreeting);
  }
  if (!welcomeMsg) {
    if (sessionLang === 'fr') {
      welcomeMsg = `Salutations, ${name || 'explorateur'} ! Je suis ${narratorDisplayName}. J'ai préparé le sentier pour ton expédition. Rends-toi au premier point indiqué sur ta carte et prépare-toi à élucider les énigmes de la forêt.`;
    } else if (sessionLang === 'en') {
      welcomeMsg = `Greetings, ${name || 'explorer'}! I am ${narratorDisplayName}. I have prepared the trail for your expedition. Head to the first point marked on your map and get ready to unravel the forest enigmas.`;
    } else {
      welcomeMsg = `¡Saludos, ${name || 'explorador'}! Soy ${narratorDisplayName}. He preparado la senda para tu expedición. Dirígete al primer punto marcado en tu mapa y prepárate a desentrañar los enigmas del bosque.`;
    }
  }

  const newSession: PlayerSession = {
    code,
    forestPackId,
    name: name || 'Aventurero',
    type: type || 'individual',
    storyId,
    difficulty: difficulty || 'novato',
    duration: duration || '1h',
    easyMode: Boolean(easyMode),
    language: sessionLang,
    currentPoiIndex: 0,
    routePoiIds,
    points: 0,
    status: 'active',
    dateStarted: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    lat: pack.centerLat,
    lng: pack.centerLng,
    messages: [
      {
        id: 'msg-welcome',
        sender: 'narrator',
        text: welcomeMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    completedPois: [],
    hintHistory: [],
    phase: 'in_transit',
    hasArrivedAtPoi: false,
    collectedRunes: [],
    bonusCompleted: [],
    metaEnigmaSolved: false,
    duelMatchCode: duelMatchCode || undefined,
    duelTeamId: duelTeamId || undefined,
  };

  if (duelMatchCode && duelMatches[duelMatchCode]) {
    const match = duelMatches[duelMatchCode];
    const team = match.teams.find((t) => t.id === duelTeamId);
    if (team) {
      team.sessionCode = code;
      saveDuels(duelMatches);
      broadcastDuel(match.code, { type: 'duel:update', match });
    }
  }

  sessions[code] = newSession;
  saveSessions(sessions);

  res.json({ session: newSession, forestPack: pack });
});

// 7. Get Session
app.get('/api/sessions/:code', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Código de partida no encontrado' });
  }

  const pack = forestPacks.find(p => p.id === session.forestPackId) || forestPacks[0];
  res.json({ session, forestPack: pack });
});

// 7bis. Arrive at POI (Sección 6bis: Desbloqueo por GPS 25m/60m o botón "Estoy aquí")
app.post('/api/sessions/:code/arrive', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  session.hasArrivedAtPoi = true;
  session.phase = 'at_poi';
  session.lastActive = new Date().toISOString();
  saveSessions(sessions);

  res.json({ session, unlocked: true });
});

// 7bis-lang. Update Session Language
app.post('/api/sessions/:code/language', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }
  const { language } = req.body;
  if (language === 'es' || language === 'fr' || language === 'en') {
    session.language = language;
    session.lastActive = new Date().toISOString();
    saveSessions(sessions);
  }
  res.json({ success: true, language: session.language });
});

// 7ter. Continue Transit (Sección 6bis: Salto al siguiente hito tras recompensa)
app.post('/api/sessions/:code/continue-transit', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  if (session.currentPoiIndex + 1 < session.routePoiIds.length) {
    session.currentPoiIndex++;
    session.hasArrivedAtPoi = false;
    session.phase = 'in_transit';
  } else {
    session.status = 'completed';
  }

  session.lastActive = new Date().toISOString();
  saveSessions(sessions);

  res.json({ session, isComplete: session.status === 'completed' });
});

// 8. Submit Answer to Current Riddle (Soporte 6ter para todos los tipos)
app.post('/api/sessions/:code/answer', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  if (session.status === 'completed' && !session.metaEnigmaSolved) {
    // Permitir continuar si queda meta-enigma
  }

  const pack = forestPacks.find(p => p.id === session.forestPackId);
  if (!pack) {
    return res.status(404).json({ error: 'Bosque no encontrado' });
  }

  const currentPoiId = session.routePoiIds[session.currentPoiIndex];
  const { userAnswer, riddleId } = req.body;
  if (!userAnswer || typeof userAnswer !== 'string') {
    return res.status(400).json({ error: 'Respuesta vacía' });
  }

  // Find riddle (by riddleId if provided for bonus, or with difficulty fallback rule)
  let riddle = riddleId ? pack.riddles.find(r => r.id === riddleId) : null;
  if (!riddle) {
    riddle = findBestRiddle(pack.riddles, currentPoiId, session.storyId, session.difficulty);
  }

  if (!riddle) {
    // Si no hay enigma, avanzar a recompensa
    if (!session.completedPois.includes(currentPoiId)) {
      session.completedPois.push(currentPoiId);
    }
    session.phase = 'reward';
    saveSessions(sessions);
    return res.json({
      session,
      isCorrect: true,
      pointsEarned: 100,
      phase: 'reward',
      isComplete: session.currentPoiIndex + 1 >= session.routePoiIds.length,
    });
  }

  // Comprobar respuesta según tipo de enigma
  let isCorrect = false;
  const normUser = normalizeAnswer(userAnswer);
  const normExpected = normalizeAnswer(riddle.answer || '');
  const acceptedNorm = (riddle.acceptedAnswers || []).map(normalizeAnswer);

  if (riddle.type === 'photo' || riddle.type === 'audio_record' || riddle.type === 'video' || riddle.type === 'mimic') {
    // Retos interactivos de foto, audio, vídeo o mímica
    isCorrect = true;
  } else if (riddle.type === 'compass') {
    // Brújula alineada
    isCorrect = normUser.includes('alinead') || normUser === '0' || normUser === 'norte' || normUser === normExpected;
  } else if (riddle.type === 'count') {
    const numUser = parseInt(userAnswer, 10);
    const target = riddle.targetCount || parseInt(riddle.answer || '0', 10) || 0;
    const tolerance = riddle.countTolerance ?? 1;
    isCorrect = !isNaN(numUser) && Math.abs(numUser - target) <= tolerance;
  } else if (riddle.type === 'order') {
    const correctItems = riddle.options || riddle.orderItems || [];
    const expectedStr = correctItems.map(normalizeAnswer).join(', ');
    const expectedArrowStr = correctItems.map(normalizeAnswer).join(' -> ');
    isCorrect =
      normUser === expectedStr ||
      normUser === expectedArrowStr ||
      normUser === normExpected ||
      acceptedNorm.includes(normUser);
  } else {
    // Multiple choice, test, text, open_text, cipher, etc.
    const isIndexMatch =
      riddle.correctIndex !== undefined &&
      riddle.options &&
      riddle.options[riddle.correctIndex] &&
      normalizeAnswer(riddle.options[riddle.correctIndex]) === normUser;

    isCorrect = Boolean(
      normUser === normExpected ||
      acceptedNorm.includes(normUser) ||
      isIndexMatch ||
      (riddle.options && riddle.correctIndex !== undefined && (userAnswer === String(riddle.correctIndex) || userAnswer === String.fromCharCode(65 + riddle.correctIndex)))
    );
  }

  if (isCorrect) {
    const isBonus = Boolean(riddle.isBonus);
    const pointsAwarded = isBonus
      ? (riddle.bonusPoints || 50)
      : (riddle.points || 100);

    session.points += pointsAwarded;
    session.lastActive = new Date().toISOString();

    const sessionLang = session.language || 'es';

    if (isBonus) {
      session.bonusCompleted = session.bonusCompleted || [];
      if (!session.bonusCompleted.includes(riddle.id)) {
        session.bonusCompleted.push(riddle.id);
      }
      saveSessions(sessions);
      const bonusMsg = translateServer('answer.bonusCorrect', sessionLang, '¡Reto extra completado! Has ganado puntos de bonificación.');
      return res.json({
        session,
        isCorrect: true,
        isBonus: true,
        pointsEarned: pointsAwarded,
        message: bonusMsg,
        messageKey: 'answer.bonusCorrect',
      });
    }

    if (!session.completedPois.includes(currentPoiId)) {
      session.completedPois.push(currentPoiId);
    }

    // Agregar runa mística para el meta-enigma final
    let revealedRune: string | undefined = riddle.metaRune;
    if (!revealedRune) {
      // Asignar letra basada en el índice para garantizar meta-enigma
      const keyword = pack.metaEnigma?.keyword || 'ROBLE';
      revealedRune = keyword[session.currentPoiIndex % keyword.length];
    }

    session.collectedRunes = session.collectedRunes || [];
    if (revealedRune && !session.collectedRunes.some(r => r.poiId === currentPoiId)) {
      session.collectedRunes.push({
        letter: revealedRune,
        poiId: currentPoiId,
        riddleName: riddle.name,
        revealedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    session.phase = 'reward';
    saveSessions(sessions);

    if (session.duelMatchCode && duelMatches[session.duelMatchCode]) {
      const match = duelMatches[session.duelMatchCode];
      const team = match.teams.find((t) => t.id === session.duelTeamId || t.sessionCode === session.code);
      if (team) {
        team.points = session.points;
        if (!team.completedPoiIds.includes(currentPoiId)) {
          team.completedPoiIds.push(currentPoiId);
        }
        team.currentPoiIndex = session.currentPoiIndex;
        team.lastActive = new Date().toISOString();

        const poiObj = pack.pois.find((p) => p.id === currentPoiId);
        const ev: DuelEvent = {
          id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'poi_cleared',
          message: `${team.emblem} ${team.name} conquistó el enigma de ${poiObj?.name || 'la senda'} (+${pointsAwarded} pts)`,
          teamId: team.id,
          teamName: team.name,
          icon: '🏆',
        };
        match.events.unshift(ev);
        if (match.events.length > 25) match.events.pop();

        if (session.completedPois.length >= session.routePoiIds.length && !match.winnerTeamId) {
          match.winnerTeamId = team.id;
          match.status = 'finished';
          match.events.unshift({
            id: `evt-win-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'meta_solved',
            message: `👑 ¡${team.emblem} ${team.name} HA GANADO LA BATALLA SILENCIOSA!`,
            teamId: team.id,
            teamName: team.name,
            icon: '👑',
          });
        }
        saveDuels(duelMatches);
        broadcastDuel(match.code, { type: 'duel:update', match, event: ev });
      }
    }

    const isLastPoi = session.currentPoiIndex + 1 >= session.routePoiIds.length;
    const correctMsg = translateServer('answer.correct', sessionLang, '¡Excelente deducción! Has resuelto el enigma del lugar.');

    return res.json({
      session,
      isCorrect: true,
      pointsEarned: pointsAwarded,
      phase: 'reward',
      metaRune: revealedRune,
      isComplete: isLastPoi,
      message: correctMsg,
      messageKey: 'answer.correct',
    });
  } else {
    const sessionLang = session.language || 'es';
    const wrongMsg = translateServer('answer.incorrect', sessionLang, 'No es la respuesta correcta. Observa con más calma tu entorno o pide una pista al guía.');
    return res.json({
      session,
      isCorrect: false,
      message: wrongMsg,
      messageKey: 'answer.incorrect',
    });
  }
});

// 8bis. Resolver Meta-Enigma Final
app.post('/api/sessions/:code/meta-enigma', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  const pack = forestPacks.find(p => p.id === session.forestPackId);
  const targetWord = pack?.metaEnigma?.keyword || 'ROBLE';
  const { answer } = req.body;
  const sessionLang = session.language || 'es';

  if (normalizeAnswer(answer) === normalizeAnswer(targetWord)) {
    session.metaEnigmaSolved = true;
    session.points += 200;
    session.status = 'completed';
    session.lastActive = new Date().toISOString();
    saveSessions(sessions);

    let successMsg = pack?.metaEnigma?.successNarrative || '';
    if ((pack?.metaEnigma as any)?.successNarrativeKey) {
      successMsg = translateServer((pack?.metaEnigma as any).successNarrativeKey, sessionLang, successMsg);
    }
    if (!successMsg) {
      successMsg = sessionLang === 'fr'
        ? 'Tu as déchiffré le mot sacré ! La forêt te reconnaît comme son protecteur.'
        : sessionLang === 'en'
        ? 'You deciphered the sacred word! The forest recognizes you as its protector.'
        : '¡Has descifrado la palabra sagrada del bosque!';
    }

    return res.json({
      session,
      isCorrect: true,
      pointsEarned: 200,
      message: successMsg,
    });
  }

  const failMsg = translateServer('answer.metaIncorrect', sessionLang, 'Esa no es la palabra sagrada. Revisa las letras que has reunido en tu códice.');
  res.json({
    session,
    isCorrect: false,
    message: failMsg,
  });
});

// 9. Request Progressive Hint (Level 1, 2, or 3)
app.post('/api/sessions/:code/hint', async (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  const pack = forestPacks.find(p => p.id === session.forestPackId);
  if (!pack) {
    return res.status(404).json({ error: 'Bosque no encontrado' });
  }

  const { level } = req.body; // 1, 2, or 3
  const targetLevel: 1 | 2 | 3 = level === 3 ? 3 : level === 2 ? 2 : 1;

  const currentPoiId = session.routePoiIds[session.currentPoiIndex];
  const poi = pack.pois.find(p => p.id === currentPoiId);
  const story = pack.stories.find(s => s.id === session.storyId);

  let riddle = pack.riddles.find(
    r => r.poiId === currentPoiId && r.storyId === session.storyId && r.difficulty === session.difficulty
  );
  if (!riddle) {
    riddle = pack.riddles.find(r => r.poiId === currentPoiId);
  }

  let hintText = '';
  const sessionLang = session.language || 'es';

  // Check if static hint is available
  const staticHintIndex = targetLevel - 1;
  let staticFallback = '';
  if (riddle?.hintsKeys && riddle.hintsKeys[staticHintIndex]) {
    staticFallback = translateServer(riddle.hintsKeys[staticHintIndex], sessionLang);
  }
  if (!staticFallback) {
    staticFallback =
      riddle?.hints?.[staticHintIndex] ||
      riddle?.staticHints?.[staticHintIndex] ||
      poi?.clueSnippet ||
      (sessionLang === 'fr'
        ? 'Observe attentivement ce qui t’entoure.'
        : sessionLang === 'en'
        ? 'Look carefully around you.'
        : 'Mira atentamente a tu alrededor.');
  }

  // If Gemini is available, generate immersive hint in narrator's voice!
  if (ai && riddle && story) {
    try {
      const guidanceByLevel = sessionLang === 'fr' ? {
        1: 'Orientation générale (35% d’indice). Donne une référence subtile sur la nature de l’objet sans dévoiler la réponse.',
        2: 'Indice de méthode ou contexte (70% d’indice). Explique comment raisonner l’énigme ou où poser le regard.',
        3: 'Indice décisif (100% d’indice). Très clair et direct, presque révélateur mais avec style littéraire.',
      }[targetLevel] : sessionLang === 'en' ? {
        1: 'General orientation (35% hint). Give a subtle reference to the concept without touching the answer.',
        2: 'Method or context clue (70% hint). Explain how to reason the riddle or where to look closely.',
        3: 'Decisive hint (100% hint). Very clear and direct, almost revealing with charm.',
      }[targetLevel] : {
        1: 'Orientación general (35% de pista). Da una referencia sutil sobre la naturaleza del objeto o concepto, sin rozar la respuesta.',
        2: 'Pista del método o contexto (70% de pista). Explica cómo razonar el enigma o dónde fijar la vista exactamente.',
        3: 'Pista decisiva (100% de pista). Muy clara y directa, casi reveladora pero con encanto literario.',
      }[targetLevel];

      const langDirective = sessionLang === 'fr'
        ? 'RÈGLE OBLIGATOIRE : Réponds en FRANÇAIS (1 à 2 phrases courtes maximum) en parlant à la première personne.'
        : sessionLang === 'en'
        ? 'MANDATORY RULE: Respond in ENGLISH (1 to 2 short sentences maximum) speaking in first person.'
        : 'REGLA OBLIGATORIA: Responde en ESPAÑOL (1 a 2 oraciones máximo) hablando en primera persona como el personaje.';

      const prompt = `Actúa como ${story.narratorName} (${story.narratorRole}), narrador de la historia "${story.title}". Tono: ${story.narratorTone || 'Inmersivo'}.
Estás guiando al jugador en el punto "${poi?.name || 'el sendero'}".
El acertijo actual es: "${riddle.question}".
La respuesta secreta es: "${riddle.answer}".
El jugador solicita una pista de Nivel ${targetLevel}: ${guidanceByLevel}.
${langDirective}
NUNCA digas directamente la palabra de la respuesta exacta en el nivel 1 o 2.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response && response.text) {
        hintText = response.text.trim();
      }
    } catch (err) {
      console.error('Gemini hint generation error, using fallback:', err);
    }
  }

  if (!hintText) {
    hintText = staticFallback;
  }

  // Deduct small points penalty for hints (Level 1: -5, Level 2: -15, Level 3: -30)
  const penalty = targetLevel === 1 ? 5 : targetLevel === 2 ? 15 : 30;
  session.points = Math.max(0, session.points - penalty);

  const hintItem = {
    poiId: currentPoiId,
    level: targetLevel,
    text: hintText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  session.hintHistory.push(hintItem);
  session.lastActive = new Date().toISOString();
  saveSessions(sessions);

  res.json({
    hint: hintText,
    level: targetLevel,
    pointsPenalty: penalty,
    currentPoints: session.points,
    narratorName: story?.narratorName || 'Guía del Bosque',
  });
});

// 10. Chat with Guide / Narrator
app.post('/api/sessions/:code/chat', async (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  const pack = forestPacks.find(p => p.id === session.forestPackId);
  const story = pack?.stories.find(s => s.id === session.storyId);
  const currentPoiId = session.routePoiIds[session.currentPoiIndex];
  const poi = pack?.pois.find(p => p.id === currentPoiId);

  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje vacío' });
  }

  // Record player message
  session.messages.push({
    id: `msg-p-${Date.now()}`,
    sender: 'player',
    text: message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  let replyText = '';
  const sessionLang = session.language || 'es';

  const isFrayBotijo = story?.id === 'fraile-botijo' || story?.narratorName?.toLowerCase().includes('botijo');
  const isCronicon = story?.id === 'guardian-iregua' || story?.narratorName?.toLowerCase().includes('cronicón') || story?.narratorName?.toLowerCase().includes('cronicon');
  const isChucho = story?.id === 'banda-palomar' || story?.narratorName?.toLowerCase().includes('chucho') || story?.narratorName?.toLowerCase().includes('palomo');
  const isZorbo = story?.id === 'expediente-zorbo' || story?.narratorName?.toLowerCase().includes('zorbo');
  const isAnselmo = story?.narratorName?.toLowerCase().includes('anselmo');
  const isJean = story?.narratorName?.toLowerCase().includes('jean') || story?.narratorName?.toLowerCase().includes('silence');
  const isPierre = story?.narratorName?.toLowerCase().includes('pierre');
  const isSylvaine = story?.narratorName?.toLowerCase().includes('sylvaine');
  const isDuendecillo = story?.narratorName?.toLowerCase().includes('duende') || story?.narratorName?.toLowerCase().includes('roble');
  const isOffenseReport = /ofendido|reportar|chiste|ofensa|disculpa|perd[oó]n|offensé|pardon|sorry|offended/i.test(message);

  const langDirective = sessionLang === 'fr'
    ? 'RÈGLE OBLIGATOIRE DE LANGUE : Réponds impérativement en FRANÇAIS (1 ou 2 phrases courtes), fidèle au style et à l’époque du personnage.'
    : sessionLang === 'en'
    ? 'MANDATORY LANGUAGE RULE: Respond strictly in ENGLISH (1 or 2 short sentences), fully staying in character and tone.'
    : 'REGLA OBLIGATORIA DE IDIOMA: Responde en ESPAÑOL auténtico (1 a 2 oraciones), metido al 100% en tu personaje.';

  if (isFrayBotijo && isOffenseReport) {
    replyText = sessionLang === 'fr'
      ? `Oh là là, l'ami ! Mille pardons à genoux devant Notre-Dame ! *rot* Ça, c'était le Saint-Esprit qui implorait clémence ! Je ne voulais blesser personne, un moine de 1387 a parfois la langue bien pendue avec le vin... Allez, trinquons virtuellement 🍷 et continuons la quête !`
      : sessionLang === 'en'
      ? `Oh boy, buddy! A thousand pardons on my knees before the Virgin! *burp* That was the Holy Spirit begging for mercy! Didn't mean to offend, pal—sometimes this 1387 monk gets loose-tongued with the wine... Come on, have a virtual sip of Rioja on me 🍷, and let's keep exploring!`
      : `¡Ostras, chaval! ¡Mil perdones de rodillas ante la Virgen de Villavieja! *eructo* ¡Eso ha sido el Espíritu Santo pidiendo clemencia! No era mi intención molestar, tronco, que a veces a este monje de 1387 se le calienta la boca con el orujo... ¡Venga, borrón y cuenta nueva! Tómate un trago virtual de este buen vino de Rioja a mi salud 🍷, que las penas con pan y vino son menos penas. ¡Salud y seguimos la senda!`;
  } else if (ai && story) {
    try {
      let prompt = '';
      if (isFrayBotijo) {
        prompt = `Eres Fray Botijo, el fantasma de un monje borracho que murió ahogado en un barril de vino en 1387 en el Monasterio de San Millán y ahora vaga por Nalda (La Rioja).
REGLAS OBLIGATORIAS:
- Hablas como un tabernero medieval cachondo.
- Usas muletillas: "chaval", "compi", "tronco", "¡ay, perdón, se me escapó!", "*eructo*", "¡eso ha sido el Espíritu Santo!".
- Cuentas chistes verdes pero SIN ser explícito: picante, no obsceno. Humor de taberna medieval, elegante y nunca vulgar ni pornográfico.
- Te ríes de curas, obispos, santos y del Papa, pero SIN ofender a la gente corriente ni a colectivos.
- Te quejas de que no has ido a misa en 600 años.
- SIEMPRE das el dato histórico correcto sobre Nalda al final de cada chiste, como si fuera una revelación divina (pero con resaca).
- Solo hablas de Nalda, su patrimonio, historia y el juego. Si te preguntan otra cosa fuera de contexto, respondes: "eso es cosa del obispo, y yo con el obispo no hablo".
- LÍNEAS ROJAS: nada de sexo explícito, nada de insultos a colectivos, nada de violencia real.
- Si el usuario parece ofendido, pide disculpas de inmediato y ofrécele un trago virtual de vino de Rioja.

Lugar actual: "${poi?.name || 'el sendero de Nalda'}".
Descripción: "${poi?.description || ''}".
El jugador dice: "${message}".
${langDirective}`;
      } else if (isCronicon) {
        prompt = `Eres El Cronicón, un sabio monje copista del siglo XIV del Monasterio de San Millán de la Cogolla que custodia la memoria histórica de Nalda y el valle del Iregua.
REGLAS OBLIGATORIAS:
- Hablas con respeto, templanza, cortesía medieval y citas refranes antiguos.
- Tratas al jugador como a un "aprendiz" o "viajero de la memoria".
- Solo respondes sobre Nalda, su historia, naturaleza y el juego.
- Eres solemne, bondadoso y gran conocedor del río Iregua, el Castillo de Nalda, el Arco de la Villa, las Cuevas de Los Palomares y la Ermita de Villavieja.

Lugar actual: "${poi?.name || 'el sendero de Nalda'}".
Descripción: "${poi?.description || ''}".
El jugador dice: "${message}".
${langDirective}`;
      } else if (isChucho) {
        prompt = `Eres Chucho el Palomo, el líder gamberro de la bandada de palomas que anida en las Cuevas de Los Palomares de Nalda (La Rioja).
REGLAS OBLIGATORIAS:
- Hablas como una paloma callejera, pícaro, canalla pero de buen corazón.
- Todo lo ves desde las alturas: tejados del castillo, el Arco de la Villa y el agua del río Iregua donde os refrescáis.
- Sabes secretos y detalles históricos reales de Nalda porque llevas generaciones sobrevolándola.

Lugar actual: "${poi?.name || 'las cornisas de Nalda'}".
Descripción: "${poi?.description || ''}".
El jugador dice: "${message}".
${langDirective}`;
      } else if (isZorbo) {
        prompt = `Eres Zorbo el Marciano, un científico alienígena del cuadrante ZX-4 extraviado en el Valle del Iregua, Nalda (La Rioja).
REGLAS OBLIGATORIAS:
- Tono: Absurdo, cósmico, perplejo y analítico ante las costumbres terrícolas.
- Usas muletillas: "¡Bip-bop!", "¡Por los anillos de Rigel!", "¡Rayos cósmicos!", "humano terrícola".
- Confundes todo con tecnología espacial alienígena: los viñedos son "paneles solares fotosintéticos", las Cuevas de Los Palomares son "cápsulas de hibernación", el Castillo es "rampa de despegue medieval", y el vino es "combustible iónico fermentado".
- Siempre integras datos reales de Nalda pasados por el filtro de tu desternillante teoría alienígena.

Lugar actual: "${poi?.name || 'sector de exploración Nalda'}".
Descripción: "${poi?.description || ''}".
El jugador dice: "${message}".
${langDirective}`;
      } else {
        prompt = `Eres ${story.narratorName}, ${story.narratorRole} en la aventura "${story.title}". Tono: ${story.narratorTone || 'Evocador y protector'}.
El jugador está explorando el bosque y actualmente se encuentra en "${poi?.name || 'un claro del bosque'}".
Descripción del lugar: "${poi?.description || ''}".
El jugador te dice: "${message}".
${langDirective}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response && response.text) {
        replyText = response.text.trim();
      }
    } catch (err) {
      console.error('Gemini chat error:', err);
    }
  }

  if (!replyText) {
    if (isFrayBotijo) {
      const frayFallbacks = sessionLang === 'fr' ? [
        `Hé l'ami ! Savais-tu qu'en 1299 Juan Núñez de Lara était enfermé au château de Nalda ? Un noble un peu casse-pieds, mais il ne tenait pas le vin comme moi ! *rot* Pardon, c'était le Saint-Esprit !`,
        `Mon pote, dans ces grottes de Los Palomares, les moines vivaient en ermites dans la roche bien avant l'arrivée des pigeons ! Allez, ouvre bien les yeux !`,
        `Tu sais pourquoi je ne vais plus à la messe depuis 1387 ? Parce que l'évêque m'a surpris en train de vider le tonneau de vin de messe ! Allez, un coup et en avant !`,
      ] : sessionLang === 'en' ? [
        `Hey buddy! Did you know that in 1299 Juan Núñez de Lara was imprisoned in Nalda Castle? A bit annoying, but he couldn't handle his wine like me! *burp* Oops, that was the Holy Spirit!`,
        `Pal, in these Los Palomares Caves monks lived as hermits in carved niches before the pigeons took over! Keep your eyes peeled on the path!`,
        `Know why I haven't been to mass since 1387, kid? The bishop caught me emptying the holy wine barrel! Take courage and keep moving!`,
      ] : [
        `¡Ehhhh, compi! ¿Sabías que en el Castillo de Nalda en 1299 encerraron a Juan Núñez de Lara? Un noble un poco plasta, ¡pero seguro que no tenía tanto aguante con el vino como yo! *eructo* ¡Ay, perdón, se me escapó! ¡Eso ha sido el Espíritu Santo!`,
        `¡Tronco, en estas Cuevas de Los Palomares los monjes vivían como ermitaños en sus hornacinas excavadas antes de que se llenara de palomas! Yo intenté confesar allí a uno, pero se me cayó la bota de vino por el barranco... ¡Hala, sigue el sendero y abre bien los ojos!`,
        `¿Sabes por qué no voy a misa desde 1387, chaval? ¡Porque el obispo me pilló vaciando el tonel de vino bendito! Pero ojo al dato histórico: el Arco de la Villa era la puerta defensiva medieval que guardaba la entrada al pueblo. ¡Venga, otro trago y adelante!`,
        `¡Qué calor hace en el valle del Iregua, tronco! Dice el cura que el agua purifica, pero yo digo que el vino alegra el alma y quita las penas. ¡Ánimo con la prueba de ${poi?.name || 'este rincón'}!`
      ];
      replyText = frayFallbacks[Math.floor(Math.random() * frayFallbacks.length)];
    } else if (isCronicon) {
      const croniconFallbacks = sessionLang === 'fr' ? [
        `Bienvenue, apprenti. « Qui garde mémoire trace un noble chemin ». Dans ce recoin de ${poi?.name || 'Nalda'}, les pierres du XIIIe siècle recèlent des secrets que seule la patience révèle.`,
        `Le cours de l'Iregua s'écoule sans hâte, comme le regard du sage observateur. Écoute les signes de la pierre et de l'eau.`,
      ] : sessionLang === 'en' ? [
        `Welcome, apprentice. 'He who keeps memory paves a good road.' In this corner of ${poi?.name || 'Nalda'}, 13th-century stones guard secrets that only patience reveals.`,
        `The waters of the Iregua flow without haste, just like the gaze of a mindful observer. Pay heed to stone and wind.`,
      ] : [
        `Bien hallado, aprendiz. "Quien guarda memoria, labra buen camino". En este rincón de ${poi?.name || 'Nalda'}, las piedras del siglo XIII guardan secretos que solo la paciencia revela.`,
        `El cauce del Iregua fluye sin prisa, como debe ser la mirada del buen observador. Atiende a las señales de la piedra, el viento y el agua.`,
        `Dicen las crónicas de San Millán que todo enigma tiene su tiempo de madurar, igual que la uva en la viña riojana. No temas errar, pues el aprendizaje es virtud.`,
      ];
      replyText = croniconFallbacks[Math.floor(Math.random() * croniconFallbacks.length)];
    } else if (isChucho) {
      const chuchoFallbacks = sessionLang === 'fr' ? [
        `Attention les plumes ! Vu du ciel, c'est limpide : au XIIIe siècle, le seigneur de Cameros surveillait toute la vallée de l'Iregua depuis ici. Ouvre l'œil !`,
        `Vol rasant sur ${poi?.name || 'Nalda'} ! Par l'Arche de la Villa, aucun étranger ne passait sans montrer patte blanche. En avant toute !`,
      ] : sessionLang === 'en' ? [
        `Heads up, feathers! From bird's-eye view it's crystal clear: in the 13th century, the Lord of Cameros watched over the whole Iregua valley from up here!`,
        `Low swoop over ${poi?.name || 'Nalda'}! Nobody passed through the Village Arch without credentials. Keep flying along the path!`,
      ] : [
        `¡Al loro, plumas! A vista de pájaro se ve clarito: en el siglo XIII el señor de Cameros vigilaba todo el paso del Iregua desde aquí arriba. ¡No te despistes y abre bien los ojos!`,
        `¿Sabías que en Los Palomares antes vivían monjes ermitaños en la roca pelada? Luego llegamos las palomas y montamos el mejor club aéreo de toda La Rioja. ¡Cuida esas migas de pan!`,
        `¡Vuelo rasante por ${poi?.name || 'Nalda'}! Por el Arco de la Villa no pasaba ni un forastero sin que la muralla le pidiera credenciales. ¡Sigue la senda que vas como un rayo!`
      ];
      replyText = chuchoFallbacks[Math.floor(Math.random() * chuchoFallbacks.length)];
    } else if (isZorbo) {
      const zorboFallbacks = sessionLang === 'fr' ? [
        `Bip-bop ! Mes capteurs quantiques indiquent que ce point de Nalda est parfait pour transmettre des ondes vers la ceinture d'astéroïdes. Poursuis l'exploration, terrien !`,
        `Rayons cosmiques ! Les indigènes de Nalda distillent ce précieux nectar qu'ils nomment vin... C'est du carburant interstellaire de classe 4 !`,
      ] : sessionLang === 'en' ? [
        `Beep-bop! My quantum sensors calibrate that this sector in Nalda is perfect for beaming signals to the asteroid belt. Continue exploring, earthling!`,
        `Cosmic rays! Nalda natives ferment grapes into what they call wine... I suspect it is warp fuel class 4!`,
      ] : [
        `¡Bip-bop! Mis sensores cuánticos calibran que la elevación de ${poi?.name || 'este punto'} en Nalda es perfecta para transmitir ondas al cinturón de asteroides. ¡Prosigue la exploración, terrícola!`,
        `¡Rayos cósmicos! Los nativos de Nalda fermentan uva para crear ese brebaje aromático que llaman vino... ¡Sospecho que es combustible de curvatura de clase 4!`,
      ];
      replyText = zorboFallbacks[Math.floor(Math.random() * zorboFallbacks.length)];
    } else if (isJean) {
      const jeanFallbacks = sessionLang === 'fr' ? [
        `Silence, camarade... En 1944 chaque ombre entre les chênes de l'Eau Bourde pouvait être un agent de la Résistance. Observe la marque gravée dans le bois.`,
        `Le message se trouve là où convergent les deux sentiers. Ne te fais pas remarquer et poursuis ta mission.`,
        `Un bon agent de liaison ne laisse jamais de traces évidentes. Affûte ton regard.`,
      ] : sessionLang === 'en' ? [
        `Silence, comrade... In 1944 every shadow among the oaks of the Eau Bourde could be a Resistance courier. Look for the carved mark on the wood.`,
        `The message is where the two trails converge. Do not draw attention and carry on with your mission.`,
        `A good scout leaves no obvious tracks. Sharpen your eyes.`,
      ] : [
        `Silencio, camarada... En 1944 cada sombra entre los robles del Eau Bourde podía ser un enlace de la Resistencia. Observa la clave tallada en la madera.`,
        `El mensaje está donde convergen los dos caminos. No llames la atención y prosigue tu misión.`,
        `Un buen enlace nunca deja huellas evidentes. Afina la mirada.`
      ];
      replyText = jeanFallbacks[Math.floor(Math.random() * jeanFallbacks.length)];
    } else if (isPierre) {
      const pierreFallbacks = sessionLang === 'fr' ? [
        `Ah, jeune apprenti ! Le son de l'eau contre les aubes du moulin a toujours rythmé la mouture. As-tu vu le canal de pierre ?`,
        `La farine pure exige de la patience, tout comme cette énigme. Examine le bois taillé et les mécanismes.`,
        `Le courant de l'Eau Bourde garde la mémoire de générations de meuniers. Ouvre grand les yeux.`,
      ] : sessionLang === 'en' ? [
        `Ah, young apprentice! The splash of water against the mill paddles has always set the pace for milling. Have you spotted the stone flume?`,
        `Clean flour requires patience, just like this riddle. Check the dimensions and carved timber.`,
        `The current of the Eau Bourde keeps the memory of generations of millers. Keep your eyes wide open.`,
      ] : [
        `¡Ah, joven aprendiz! El sonido del agua contra las paletas del molino siempre marcaba el ritmo de la molienda. ¿Has visto el canal de piedra?`,
        `El grano limpio requiere paciencia, igual que este enigma. Revisa las medidas y la madera tallada.`,
        `La corriente del Eau Bourde guarda la memoria de generaciones de molineros. Abre bien los ojos.`
      ];
      replyText = pierreFallbacks[Math.floor(Math.random() * pierreFallbacks.length)];
    } else if (isSylvaine) {
      const sylvaineFallbacks = sessionLang === 'fr' ? [
        `Les feuilles murmurent des chants anciens si l'on sait garder le silence... Cette clairière respire une vie millénaire.`,
        `L'eau limpide reflète la vérité de qui cherche avec noblesse. Observe le reflet et les fougères.`,
        `Ne cherche pas avec précipitation, mais avec la finesse de tes sens. La forêt te guidera.`,
      ] : sessionLang === 'en' ? [
        `The leaves whisper ancient songs if you know how to remain quiet... This forest clearing breathes age-old life.`,
        `Clear water reflects the truth of whoever seeks with nobility. Attend to the ripple and the ferns.`,
        `Seek not with haste, but with the sensitivity of your senses. The woodland shall guide you.`,
      ] : [
        `Las hojas susurran canciones antiguas si sabes guardar quietud... Este claro del bosque respira vida milenaria.`,
        `El agua clara refleja la verdad de quien busca con nobleza. Atiende al reflejo y a los helechos.`,
        `No busques con la fuerza, sino con la sensibilidad de los sentidos. El bosque te guiará.`
      ];
      replyText = sylvaineFallbacks[Math.floor(Math.random() * sylvaineFallbacks.length)];
    } else if (isDuendecillo) {
      const duendeFallbacks = sessionLang === 'fr' ? [
        `Hé hé ! As-tu vu mon gland doré ? Le plus vieux chêne de Canéjan m'a murmuré une énigme ce matin !`,
        `Enjambe la racine et cherche la trace cachée ! Tu t'en sors à merveille, explorateur !`,
      ] : sessionLang === 'en' ? [
        `Hehe! Did you spot my shiny acorn? The oldest oak in Canéjan told me a riddle this morning!`,
        `Hop over the mossy root and search for the hidden sign! You are doing great, explorer!`,
      ] : [
        `¡Je, je, je! ¿Has visto qué bellota tan brillante tengo aquí? ¡El roble más viejo de Canéjan me contó el acertijo esta mañana!`,
        `¡Salta la raíz y busca la señal que pintaron los niños de la escuela! ¡Vas muy bien, explorador!`,
        `¡Una rimilla para el camino: quien busca con alegría, encuentra la pista al mediodía!`
      ];
      replyText = duendeFallbacks[Math.floor(Math.random() * duendeFallbacks.length)];
    } else {
      const fallbacks = sessionLang === 'fr' ? [
        `Écoute le bruissement des feuilles sous tes pas vers ${poi?.name || 'ce lieu'}. La forêt récompense toujours les pas attentifs.`,
        `Le sentier recèle des secrets que seuls les yeux patients découvrent. Poursuis ta route !`,
      ] : sessionLang === 'en' ? [
        `Listen to the rustling leaves beneath your feet near ${poi?.name || 'this spot'}. The forest always rewards the observant traveler.`,
        `The trail guards secrets that only patient eyes discover. Advance with confidence!`,
      ] : [
        `Escucha con atención el crujido de las hojas bajo tus pies en ${poi?.name || 'este rincón'}. El bosque siempre recompensa a quien sabe esperar.`,
        `El sendero guarda secretos que sólo los ojos pacientes pueden advertir. Sigue adelante con valor.`,
        `Las señales están en la piedra, en la madera y en el agua. Abre bien los sentidos.`,
      ];
      replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
  }

  const guideMsg = {
    id: `msg-n-${Date.now()}`,
    sender: 'narrator' as const,
    text: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  session.messages.push(guideMsg);
  session.lastActive = new Date().toISOString();
  saveSessions(sessions);

  res.json({ reply: guideMsg });
});

// 11. Update Player Location
app.post('/api/sessions/:code/location', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  const { lat, lng } = req.body;
  if (typeof lat === 'number' && typeof lng === 'number') {
    session.lat = lat;
    session.lng = lng;
    session.lastActive = new Date().toISOString();
    saveSessions(sessions);

    if (session.duelMatchCode && duelMatches[session.duelMatchCode]) {
      const match = duelMatches[session.duelMatchCode];
      const team = match.teams.find((t) => t.id === session.duelTeamId || t.sessionCode === session.code);
      if (team) {
        team.lat = lat;
        team.lng = lng;
        team.lastActive = new Date().toISOString();
        broadcastDuel(match.code, { type: 'duel:update', match });
      }
    }
  }

  res.json({ success: true });
});

// 11b. Abandon Session (Mark as abandoned)
app.post('/api/sessions/:code/abandon', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  session.status = 'abandoned';
  session.lastActive = new Date().toISOString();
  saveSessions(sessions);

  res.json({ success: true, session });
});

// 12. Submit Rating & Feedback
app.post('/api/sessions/:code/feedback', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  const { rating, comment } = req.body;
  session.rating = typeof rating === 'number' ? rating : 5;
  session.feedback = comment || '';

  const pack = forestPacks.find(p => p.id === session.forestPackId);
  const story = pack?.stories.find(s => s.id === session.storyId);

  const fbItem: PlayerFeedback = {
    id: `fb-${Date.now()}`,
    sessionCode: code,
    forestPackId: session.forestPackId,
    playerName: session.name,
    storyTitle: story?.title || 'Aventura en el bosque',
    rating: session.rating,
    comment: session.feedback || '',
    date: new Date().toLocaleDateString('es-ES'),
  };

  feedbackList.unshift(fbItem);
  saveFeedback(feedbackList);
  saveSessions(sessions);

  res.json({ success: true });
});

// -------------------------------------------------------------
// Modo Equipos / Batalla Silenciosa Endpoints
// -------------------------------------------------------------

// Create Duel Room
app.post('/api/duels/create', (req: Request, res: Response) => {
  const { forestPackId, storyId, teamName, emblem, color, includeShadowRival, language } = req.body;
  const pack = forestPacks.find((p) => p.id === forestPackId) || forestPacks[0];
  const story = pack.stories.find((s) => s.id === storyId) || pack.stories[0];

  let code = `DUEL-${Math.floor(1000 + Math.random() * 9000)}`;
  while (duelMatches[code]) {
    code = `DUEL-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  let sessionCode = generateSessionCode();
  while (sessions[sessionCode]) {
    sessionCode = generateSessionCode();
  }

  const team1: DuelTeam = {
    id: `team-${Date.now()}-1`,
    name: teamName || (language === 'fr' ? "Les Loups d'Iregua" : language === 'en' ? 'The Iregua Wolves' : 'Los Lobos del Iregua'),
    color: color || '#10b981',
    emblem: emblem || '🐺',
    sessionCode,
    points: 0,
    completedPoiIds: [],
    currentPoiIndex: 0,
    totalPois: pack.pois.length,
    lat: pack.centerLat,
    lng: pack.centerLng,
    lastActive: new Date().toISOString(),
    activeEffects: [],
  };

  const newSession: PlayerSession = {
    code: sessionCode,
    forestPackId: pack.id,
    name: team1.name,
    type: 'grupo',
    storyId: story.id,
    difficulty: 'explorador',
    duration: '1h',
    easyMode: false,
    language: language || 'es',
    currentPoiIndex: 0,
    routePoiIds: pack.pois.map((p) => p.id),
    points: 0,
    status: 'active',
    dateStarted: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    lat: pack.centerLat,
    lng: pack.centerLng,
    messages: [
      {
        id: 'msg-duel-welcome',
        sender: 'narrator',
        text: `⚔️ ¡Comienza la Batalla Silenciosa en ${pack.name}! Avanzad con sigilo por la senda.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    completedPois: [],
    hintHistory: [],
    phase: 'in_transit',
    hasArrivedAtPoi: false,
    collectedRunes: [],
    bonusCompleted: [],
    duelMatchCode: code,
    duelTeamId: team1.id,
  };

  sessions[sessionCode] = newSession;
  saveSessions(sessions);

  const teams: DuelTeam[] = [team1];
  let status: 'waiting' | 'in_progress' = 'waiting';

  if (includeShadowRival) {
    const botTeam: DuelTeam = {
      id: `bot-${Date.now()}`,
      name: language === 'fr' ? 'La Fraternité du Faucon' : language === 'en' ? 'The Falcon Fellowship' : 'La Hermandad del Tejo',
      color: '#f59e0b',
      emblem: '🦉',
      sessionCode: `BOT-${code}`,
      points: 0,
      completedPoiIds: [],
      currentPoiIndex: 0,
      totalPois: pack.pois.length,
      lat: pack.centerLat + 0.0003,
      lng: pack.centerLng + 0.0003,
      lastActive: new Date().toISOString(),
      activeEffects: [],
      isBot: true,
    };
    teams.push(botTeam);
    status = 'in_progress';
  }

  const match: DuelMatch = {
    code,
    forestPackId: pack.id,
    storyId: story.id,
    status,
    createdAt: new Date().toISOString(),
    teams,
    events: [
      {
        id: `evt-start-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'duel_started',
        message: `⚔️ Sala de duelo creada en ${pack.name}. ${includeShadowRival ? '¡El Guardián Fantasma ha aceptado el reto!' : 'Esperando a que el rival ingrese el código...' }`,
        teamId: team1.id,
        teamName: team1.name,
        icon: '⚔️',
      },
    ],
  };

  duelMatches[code] = match;
  saveDuels(duelMatches);

  if (includeShadowRival) {
    startShadowRivalBot(code);
  }

  res.json({ match, team: team1, sessionCode });
});

// Join Duel Room
app.post('/api/duels/join', (req: Request, res: Response) => {
  const { code, teamName, emblem, color, language } = req.body;
  const matchCode = code ? String(code).trim().toUpperCase() : '';
  const match = duelMatches[matchCode];

  if (!match) {
    return res.status(404).json({ error: 'Código de batalla no encontrado' });
  }

  if (match.status === 'finished') {
    return res.status(400).json({ error: 'Esta batalla ya ha concluido' });
  }

  const pack = forestPacks.find((p) => p.id === match.forestPackId) || forestPacks[0];
  const story = pack.stories.find((s) => s.id === match.storyId) || pack.stories[0];

  let sessionCode = generateSessionCode();
  while (sessions[sessionCode]) {
    sessionCode = generateSessionCode();
  }

  const team2: DuelTeam = {
    id: `team-${Date.now()}-2`,
    name: teamName || (language === 'fr' ? 'Les Aigles de Nalda' : language === 'en' ? 'The Nalda Eagles' : 'Las Águilas de Nalda'),
    color: color || '#3b82f6',
    emblem: emblem || '🦅',
    sessionCode,
    points: 0,
    completedPoiIds: [],
    currentPoiIndex: 0,
    totalPois: pack.pois.length,
    lat: pack.centerLat,
    lng: pack.centerLng,
    lastActive: new Date().toISOString(),
    activeEffects: [],
  };

  const newSession: PlayerSession = {
    code: sessionCode,
    forestPackId: pack.id,
    name: team2.name,
    type: 'grupo',
    storyId: story.id,
    difficulty: 'explorador',
    duration: '1h',
    easyMode: false,
    language: language || 'es',
    currentPoiIndex: 0,
    routePoiIds: pack.pois.map((p) => p.id),
    points: 0,
    status: 'active',
    dateStarted: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    lat: pack.centerLat,
    lng: pack.centerLng,
    messages: [
      {
        id: 'msg-duel-welcome-2',
        sender: 'narrator',
        text: `⚔️ ¡Te has unido a la Batalla Silenciosa! Compite con sigilo frente a ${match.teams[0]?.name}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    completedPois: [],
    hintHistory: [],
    phase: 'in_transit',
    hasArrivedAtPoi: false,
    collectedRunes: [],
    bonusCompleted: [],
    duelMatchCode: matchCode,
    duelTeamId: team2.id,
  };

  sessions[sessionCode] = newSession;
  saveSessions(sessions);

  match.teams.push(team2);
  match.status = 'in_progress';

  const joinEvt: DuelEvent = {
    id: `evt-join-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'duel_started',
    message: `⚡ ¡${team2.emblem} ${team2.name} se ha unido al combate frente a ${match.teams[0]?.name}!`,
    teamId: team2.id,
    teamName: team2.name,
    icon: '⚡',
  };
  match.events.unshift(joinEvt);

  saveDuels(duelMatches);
  broadcastDuel(matchCode, { type: 'duel:update', match, event: joinEvt });

  res.json({ match, team: team2, sessionCode });
});

// Get Duel State
app.get('/api/duels/:code', (req: Request, res: Response) => {
  const matchCode = req.params.code.toUpperCase();
  const match = duelMatches[matchCode];
  if (!match) {
    return res.status(404).json({ error: 'Duelo no encontrado' });
  }
  res.json({ match });
});

// Trigger Tactical Duel Powerup
app.post('/api/duels/:code/action', (req: Request, res: Response) => {
  const matchCode = req.params.code.toUpperCase();
  const match = duelMatches[matchCode];
  if (!match) {
    return res.status(404).json({ error: 'Duelo no encontrado' });
  }

  const { teamId, actionType } = req.body;
  const sourceTeam = match.teams.find((t) => t.id === teamId);
  const rivalTeam = match.teams.find((t) => t.id !== teamId);

  if (!sourceTeam || !rivalTeam) {
    return res.status(400).json({ error: 'Equipos no encontrados' });
  }

  if (actionType === 'fog') {
    rivalTeam.activeEffects.push({
      id: `eff-fog-${Date.now()}`,
      type: 'fog',
      expiresAt: Date.now() + 30000,
      sourceTeamName: sourceTeam.name,
    });
    const ev: DuelEvent = {
      id: `evt-fog-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'powerup_used',
      message: `🌫️ ${sourceTeam.emblem} ${sourceTeam.name} invocó Niebla Mística sobre ${rivalTeam.name}!`,
      teamId: sourceTeam.id,
      teamName: sourceTeam.name,
      icon: '🌫️',
    };
    match.events.unshift(ev);
    if (match.events.length > 30) match.events.pop();
  } else if (actionType === 'whisper') {
    const ev: DuelEvent = {
      id: `evt-whisp-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'powerup_used',
      message: `🦉 ${sourceTeam.emblem} ${sourceTeam.name} consultó al Búho para rastrear al rival.`,
      teamId: sourceTeam.id,
      teamName: sourceTeam.name,
      icon: '🦉',
    };
    match.events.unshift(ev);
    if (match.events.length > 30) match.events.pop();
  } else if (actionType === 'echo') {
    const ev: DuelEvent = {
      id: `evt-echo-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'powerup_used',
      message: `🍃 ${sourceTeam.emblem} ${sourceTeam.name} envió un crujido misterioso por las ramas...`,
      teamId: sourceTeam.id,
      teamName: sourceTeam.name,
      icon: '🍃',
    };
    match.events.unshift(ev);
    if (match.events.length > 30) match.events.pop();
  }

  saveDuels(duelMatches);
  broadcastDuel(matchCode, {
    type: 'duel:action_received',
    targetTeamId: rivalTeam.id,
    actionType,
    sourceTeamName: sourceTeam.name,
    match,
  });
  broadcastDuel(matchCode, { type: 'duel:update', match });

  res.json({ success: true, match });
});

// 13. Admin: Live Sessions (Admin Only)
app.get('/api/admin/sessions', requireAdmin, (_req: Request, res: Response) => {
  const list = Object.values(sessions).sort(
    (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
  );
  res.json(list);
});

// 14. Admin: Broadcast / Send Message to Session (Admin Only)
app.post('/api/admin/sessions/:code/message', requireAdmin, (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Texto requerido' });
  }

  if (code === 'ALL') {
    Object.values(sessions).forEach(sess => {
      sess.messages.push({
        id: `msg-adm-${Date.now()}-${Math.random()}`,
        sender: 'admin',
        text: `[Aviso del Director del Bosque]: ${text}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });
    saveSessions(sessions);
    return res.json({ success: true, count: Object.keys(sessions).length });
  }

  const session = sessions[code];
  if (!session) {
    return res.status(404).json({ error: 'Partida no encontrada' });
  }

  session.messages.push({
    id: `msg-adm-${Date.now()}`,
    sender: 'admin',
    text: `[Mensaje de Organización]: ${text}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  saveSessions(sessions);
  res.json({ success: true });
});

// 15. Admin: Stats & Feedback (Admin Only)
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const allSessions = Object.values(sessions);
  const totalSessions = allSessions.length;
  const completedSessions = allSessions.filter(s => s.status === 'completed').length;
  const activeSessions = allSessions.filter(s => s.status === 'active').length;

  const totalRating = feedbackList.reduce((acc, f) => acc + (f.rating || 5), 0);
  const avgRating = feedbackList.length > 0 ? (totalRating / feedbackList.length).toFixed(1) : '5.0';

  const storyCount: Record<string, number> = {};
  allSessions.forEach(s => {
    storyCount[s.storyId] = (storyCount[s.storyId] || 0) + 1;
  });

  res.json({
    totalSessions,
    completedSessions,
    activeSessions,
    avgRating,
    totalFeedback: feedbackList.length,
    recentFeedback: feedbackList.slice(0, 20),
    storyDistribution: storyCount,
  });
});

// 16. AI Assistant: Draft new Forest Pack from brief description (Admin Only)
app.post('/api/ai/generate-forest', requireAdmin, async (req: Request, res: Response) => {
  const { promptText, baseLat, baseLng } = req.body;
  if (!promptText) {
    return res.status(400).json({ error: 'Se requiere una descripción del bosque' });
  }

  const centerLat = typeof baseLat === 'number' ? baseLat : 40.4168;
  const centerLng = typeof baseLng === 'number' ? baseLng : -3.7038;

  if (ai) {
    try {
      const systemInstruction = `Eres un diseñador de side quests de misterio y naturaleza al aire libre en España y Europa.
Genera un paquete de bosque completo en formato JSON con:
- name: nombre evocador del bosque
- description: breve descripción mágica o histórica
- pois: array de 4 puntos de interés geolocalizados cerca de las coordenadas centrales lat=${centerLat}, lng=${centerLng} (desviaciones de +-0.003). Cada uno con id, name, description, lat, lng, emoji, clueSnippet.
- stories: array con 1 historia envolvente (id, title, icon, summary, narrative, mission, narratorName, narratorRole, narratorTone).
- riddles: array con 4 acertijos (1 por POI) adecuados para la historia y de dificultad novato o explorador. Cada acertijo debe tener id, poiId, storyId, name, difficulty, question, options (array de 3-4 opciones), answer, points (100-150), staticHints (array de 3 strings con pistas progresivas).
- sceneNarratives: objeto mapa donde las claves son \`\${storyId}_\${poiId}\` y los valores son textos de ambientación.

Devuelve EXCLUSIVAMENTE el objeto JSON válido.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Crea un paquete de bosque basado en esta idea: "${promptText}". Coordenadas centrales: lat ${centerLat}, lng ${centerLng}.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      if (response && response.text) {
        const generated = JSON.parse(response.text);
        const packId = (generated.name || 'nuevo-bosque')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4);

        const fullPack: ForestPack = {
          id: packId,
          name: generated.name || 'Bosque Misterioso',
          country: 'Local',
          description: generated.description || promptText,
          centerLat,
          centerLng,
          coverImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
          isPublished: true,
          pois: generated.pois || [],
          routePresets: {
            '30min': (generated.pois || []).slice(0, 2).map((p: any) => p.id),
            '1h': (generated.pois || []).slice(0, 3).map((p: any) => p.id),
            '1.5h': (generated.pois || []).map((p: any) => p.id),
            '2h': (generated.pois || []).map((p: any) => p.id),
          },
          stories: generated.stories || [],
          riddles: generated.riddles || [],
          sceneNarratives: generated.sceneNarratives || {},
        };

        return res.json(fullPack);
      }
    } catch (err) {
      console.error('AI draft generation error:', err);
    }
  }

  // Fallback programmatic generation if no Gemini key or offline
  const fallbackId = 'bosque-local-' + Date.now().toString().slice(-4);
  const fallbackPack: ForestPack = {
    id: fallbackId,
    name: 'Ruta Natural: ' + promptText.slice(0, 25),
    country: 'Local',
    description: promptText,
    centerLat,
    centerLng,
    coverImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    pois: [
      {
        id: 'poi-1',
        name: 'El Árbol Centenario',
        description: 'Punto de partida del sendero arbolado.',
        lat: centerLat + 0.001,
        lng: centerLng - 0.001,
        emoji: '🌳',
        clueSnippet: 'Observa la corteza expuesta al sol matutino.',
      },
      {
        id: 'poi-2',
        name: 'El Manantial Oculto',
        description: 'Piedras cubiertas de musgo donde brota agua.',
        lat: centerLat + 0.002,
        lng: centerLng + 0.001,
        emoji: '💧',
        clueSnippet: 'El sonido del agua te guiará entre las ramas.',
      },
      {
        id: 'poi-3',
        name: 'El Mirador del Risco',
        description: 'Vistas panorámicas hacia el horizonte.',
        lat: centerLat - 0.0015,
        lng: centerLng + 0.002,
        emoji: '🔭',
        clueSnippet: 'Busca el horizonte más despejado hacia el poniente.',
      },
    ],
    routePresets: {
      '30min': ['poi-1', 'poi-2'],
      '1h': ['poi-1', 'poi-2', 'poi-3'],
      '1.5h': ['poi-1', 'poi-2', 'poi-3'],
      '2h': ['poi-1', 'poi-2', 'poi-3'],
    },
    stories: [
      {
        id: 'exploracion-local',
        title: 'Los Secretos del Sendero',
        icon: '🧭',
        summary: 'Una aventura de orientación y observación natural.',
        narrative: 'El sendero oculta detalles que pasan desapercibidos a los caminantes apresurados.',
        mission: 'Encuentra los elementos señalados y supera las pruebas de observación.',
        narratorName: 'Guarda Forestal',
        narratorRole: 'Protector de la flora y fauna local',
        narratorTone: 'Práctico y pedagógico',
      },
    ],
    riddles: [
      {
        id: 'rid-1',
        poiId: 'poi-1',
        storyId: 'exploracion-local',
        name: 'La Prueba del Árbol',
        difficulty: 'novato',
        question: '¿Qué ser vivo produce la mayor parte del oxígeno y madera en este claro?',
        options: ['Los árboles y plantas', 'Las rocas calcáreas', 'La brisa del viento'],
        answer: 'Los árboles y plantas',
        points: 100,
        staticHints: ['Son organismos vegetales con clorofila.', 'Realizan la fotosíntesis.', 'Son los árboles y plantas.'],
      },
      {
        id: 'rid-2',
        poiId: 'poi-2',
        storyId: 'exploracion-local',
        name: 'El Ciclo del Agua',
        difficulty: 'novato',
        question: '¿De dónde proviene principalmente el agua subterránea que alimenta este manantial?',
        options: ['De las lluvias filtradas en la montaña', 'Del deshielo de otro planeta', 'De tuberías de plástico'],
        answer: 'De las lluvias filtradas en la montaña',
        points: 100,
        staticHints: ['Cae de las nubes sobre el monte.', 'Se filtra por la tierra y la roca caliza.', 'De las lluvias filtradas en la montaña.'],
      },
      {
        id: 'rid-3',
        poiId: 'poi-3',
        storyId: 'exploracion-local',
        name: 'Orientación Solar',
        difficulty: 'novato',
        question: '¿Por qué punto cardinal se oculta el sol al atardecer en el mirador?',
        options: ['Oeste', 'Norte', 'Este'],
        answer: 'Oeste',
        points: 100,
        staticHints: ['Es el lado opuesto al amanecer.', 'El sol nace por el Este y se pone por...', 'Oeste.'],
      },
    ],
    sceneNarratives: {
      'exploracion-local_poi-1': 'Llegas bajo la frondosa copa del árbol centenario. La sombra invita a respirar hondo.',
      'exploracion-local_poi-2': 'El rumor fresco del manantial te recibe entre las piedras húmedas.',
      'exploracion-local_poi-3': 'El mirador abre el paisaje ante tus ojos, donde el bosque abraza el valle.',
    },
  };

  res.json(fallbackPack);
});

// 17. Get all characters across forest packs
app.get('/api/characters', (_req: Request, res: Response) => {
  const characters: Array<{
    id: string;
    forestPackId: string;
    forestName: string;
    title: string;
    narratorName: string;
    narratorRole: string;
    narratorTone?: string;
    narratorAvatar?: string;
    voiceName?: string;
    characterBio?: string;
    characterGreeting?: string;
  }> = [];

  forestPacks.forEach((pack) => {
    pack.stories.forEach((story) => {
      characters.push({
        id: story.id,
        forestPackId: pack.id,
        forestName: pack.name,
        title: story.title,
        narratorName: story.narratorName || story.narrator?.name || 'Guía del Bosque',
        narratorRole: story.narratorRole || story.narrator?.role || 'Compañero de ruta',
        narratorTone: story.narratorTone || story.narrator?.tone,
        narratorAvatar: story.narratorAvatar || story.narrator?.avatarEmoji || '🧙‍♂️',
        voiceName: story.voiceName || (story.narrator?.ttsVoice as any) || 'Zephyr',
        characterBio: story.characterBio,
        characterGreeting: story.characterGreeting,
      });
    });
  });

  res.json(characters);
});

// -------------------------------------------------------------
// Vite Middleware / Static Production Serving & WebSocket Server
// -------------------------------------------------------------
async function startServer() {
  const server = http.createServer(app);

  // Setup WebSocket server for Gemini 3.8 Live API
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    if (url.pathname === '/live' || url.pathname === '/api/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else if (url.pathname === '/duel' || url.pathname === '/api/duel') {
      duelWss.handleUpgrade(request, socket, head, (ws) => {
        duelWss.emit('connection', ws, request);
      });
    }
  });

  duelWss.on('connection', (clientWs: WebSocket, request: http.IncomingMessage) => {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    const matchCode = url.searchParams.get('matchCode')?.toUpperCase() || '';
    const teamId = url.searchParams.get('teamId') || '';

    if (matchCode) {
      if (!duelClients.has(matchCode)) {
        duelClients.set(matchCode, new Set());
      }
      const entry = { ws: clientWs, teamId };
      duelClients.get(matchCode)!.add(entry);

      if (duelMatches[matchCode]) {
        clientWs.send(JSON.stringify({ type: 'duel:init', match: duelMatches[matchCode] }));
      }

      clientWs.on('message', (raw) => {
        try {
          const data = JSON.parse(raw.toString());
          if (data.type === 'subscribe' && data.matchCode && duelMatches[data.matchCode]) {
            clientWs.send(JSON.stringify({ type: 'duel:init', match: duelMatches[data.matchCode] }));
          } else if (data.type === 'duel:move' && data.matchCode && duelMatches[data.matchCode]) {
            const m = duelMatches[data.matchCode];
            const t = m.teams.find((tm) => tm.id === data.teamId);
            if (t && typeof data.lat === 'number' && typeof data.lng === 'number') {
              t.lat = data.lat;
              t.lng = data.lng;
              t.lastActive = new Date().toISOString();
              broadcastDuel(data.matchCode, { type: 'duel:update', match: m });
            }
          }
        } catch {}
      });

      clientWs.on('close', () => {
        duelClients.get(matchCode)?.delete(entry);
      });
    }
  });

  wss.on('connection', async (clientWs: WebSocket, request: http.IncomingMessage) => {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    const sessionCode = url.searchParams.get('sessionCode')?.toUpperCase() || '';
    const storyIdParam = url.searchParams.get('storyId') || '';
    const poiIdParam = url.searchParams.get('poiId') || '';
    const forestPackIdParam = url.searchParams.get('forestPackId') || '';

    const session = sessions[sessionCode];
    const forestPackId = session?.forestPackId || forestPackIdParam || forestPacks[0]?.id;
    const pack = forestPacks.find((p) => p.id === forestPackId) || forestPacks[0];

    const targetStoryId = session?.storyId || storyIdParam || pack?.stories[0]?.id;
    const story = pack?.stories.find((s) => s.id === targetStoryId) || pack?.stories[0];

    const currentPoiId = session?.routePoiIds[session?.currentPoiIndex || 0] || poiIdParam || pack?.pois[0]?.id;
    const poi = pack?.pois.find((p) => p.id === currentPoiId) || pack?.pois[0];

    const riddle = pack?.riddles.find(
      (r) => r.poiId === currentPoiId && r.storyId === targetStoryId
    ) || pack?.riddles.find((r) => r.poiId === currentPoiId);

    const voiceName = (story?.voiceName || 'Zephyr') as 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';

    if (!ai) {
      clientWs.send(
        JSON.stringify({
          type: 'status',
          status: 'simulated',
          message: 'Modo audio en tiempo real activo en emulación (sin API key de Gemini Live).',
        })
      );
      return;
    }

    try {
      const isFrayBotijo = story?.id === 'fraile-botijo' || story?.narratorName?.toLowerCase().includes('botijo');
      const isCronicon = story?.id === 'guardian-iregua' || story?.narratorName?.toLowerCase().includes('cronicón') || story?.narratorName?.toLowerCase().includes('cronicon');
      const isChucho = story?.id === 'banda-palomar' || story?.narratorName?.toLowerCase().includes('chucho') || story?.narratorName?.toLowerCase().includes('palomo');
      const isZorbo = story?.id === 'expediente-zorbo' || story?.narratorName?.toLowerCase().includes('zorbo');

      let dynamicVoiceName = voiceName;
      if (isFrayBotijo) dynamicVoiceName = 'Charon';
      else if (isCronicon) dynamicVoiceName = 'Fenrir';
      else if (isChucho) dynamicVoiceName = 'Puck';
      else if (isZorbo) dynamicVoiceName = 'Zephyr';

      const liveLang = session?.language || 'es';
      const liveLangDirective = liveLang === 'fr'
        ? 'Parle impérativement en FRANÇAIS, en 1 ou 2 phrases orales courtes et dynamiques.'
        : liveLang === 'en'
        ? 'Speak strictly in ENGLISH, in 1 or 2 short, engaging spoken sentences.'
        : 'Habla en 1 o 2 oraciones breves y orales en español.';

      let systemInstruction = '';
      if (isFrayBotijo) {
        systemInstruction = `Actúa SIEMPRE como Fray Botijo, el fantasma de un monje borracho ahogado en un barril de vino en 1387 en el Monasterio de San Millán, ahora en Nalda.
Personalidad: Tabernero medieval cachondo, irreverente y sabio.
Muletillas a usar: "chaval", "compi", "tronco", "¡ay, perdón, se me escapó!", "*eructo*", "¡eso ha sido el Espíritu Santo!".
El explorador se llama "${session?.name || 'Aventurero'}" y está en "${poi?.name || 'el sendero de Nalda'}".
REGLAS ESENCIALES:
1. Habla como un tabernero medieval chistoso y socarrón, con chistes picantes pero nunca obscenos (humor de taberna, no de prostíbulo).
2. Ríete con cariño de curas, obispos y del Papa, sin ofender a nadie común.
3. Quéjate de que llevas 600 años sin ir a misa.
4. SIEMPRE da el dato histórico real de Nalda al final de cada chiste como una revelación divina con resaca.
5. Si preguntan otra cosa fuera de Nalda: "eso es cosa del obispo, y yo con el obispo no hablo".
6. Si alguien se ofende, pide perdón de rodillas ante la Virgen de Villavieja y ofrécele un trago virtual de vino de Rioja.
7. ${liveLangDirective}`;
      } else if (isChucho) {
        systemInstruction = `Actúa SIEMPRE como Chucho el Palomo, una paloma gamberra y canalla, líder de la bandada de las Cuevas de Los Palomares de Nalda.
Personalidad: Pícaro callejero, ágil, gamberro y protector de su bandada.
Muletillas: "¡oye, plumas!", "¡al loro!", "¡vuelo rasante!", "a vista de pájaro", "¡menudo pichón!".
El explorador se llama "${session?.name || 'Aventurero'}" y está en "${poi?.name || 'las calles de Nalda'}".
REGLAS:
1. Habla rápido y divertido como un pájaro callejero con experiencia.
2. Comenta los hitos de Nalda desde las alturas (el tejado del castillo, las almenas, las cuevas en la roca).
3. Pide migas de pan y anima a observar las pistas del bosque.
4. ${liveLangDirective}`;
      } else if (isZorbo) {
        systemInstruction = `Actúa SIEMPRE como Zorbo el Marciano, un científico alienígena del cuadrante ZX-4 cuya nave se estrelló en el Valle del Iregua, Nalda.
Personalidad: Absurdo, cósmico, perplejo y analítico con las costumbres terrícolas.
Muletillas: "¡Bip-bop!", "¡Por las lunas de Rigel!", "¡Rayos cósmicos!", "espécimen humano".
El explorador se llama "${session?.name || 'Aventurero'}" y está en "${poi?.name || 'sector de exploración Nalda'}".
REGLAS:
1. Confunde con humor cósmico los viñedos, cuevas y castillos de Nalda con tecnología espacial.
2. Da el dato histórico de Nalda pero interpretado bajo tu teoría marciana.
3. ${liveLangDirective}`;
      } else {
        systemInstruction = `Actúa SIEMPRE como ${story?.narratorName || 'Guía del Bosque'} (${story?.narratorRole || 'Personaje de la historia'}), un personaje inmersivo del bosque de "${pack?.name}".
Personalidad y tono: ${story?.narratorTone || 'Cálido, aventurero y sugerente'}.
Biografía del personaje: ${story?.characterBio || 'Un ser que conoce cada sendero y misterio del lugar.'}.
El explorador se llama "${session?.name || 'Aventurero'}" y está en una ruta a pie por el bosque.
Actualmente se encuentra físicamente en el punto de interés: "${poi?.name || 'el sendero'}".
Descripción del punto: "${poi?.description || ''}".
Enigma de este punto: "${riddle?.question || 'Observar la naturaleza'}".
Solución secreta: "${riddle?.answer || ''}".
Pistas contextuales: "${poi?.clueSnippet || ''}".

REGLAS DE ORO PARA LA CONVERSACIÓN POR VOZ:
1. ${liveLangDirective}
2. NUNCA rompas el personaje. Eres el personaje de carne y hueso (o espíritu) en el bosque, NO una IA ni un programa de ordenador.
3. Si el jugador te pide ayuda con el enigma, dale pistas sensoriales de lo que tiene a su alrededor (la corteza, el río, las piedras, el viento), pero NO le reveles la respuesta directamente.
4. Si el jugador acierta o menciona la solución correcta, felicítale efusivamente como el personaje.
5. Responde con calidez y pasión por este bosque.`;
      }

      const liveSession = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: dynamicVoiceName },
            },
          },
          systemInstruction,
          outputAudioTranscription: {},
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'audio',
                      audio: part.inlineData.data,
                    })
                  );
                }
              }
              if (part.text) {
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'transcript',
                      text: part.text,
                      sender: 'character',
                    })
                  );
                }
              }
            }

            if (message.serverContent?.interrupted) {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
              }
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'status', status: 'closed' }));
            }
          },
          onerror: (err) => {
            console.error('Gemini Live session error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'error', message: String(err) }));
            }
          },
        },
      });

      clientWs.send(
        JSON.stringify({
          type: 'connected',
          characterName: story?.narratorName,
          characterRole: story?.narratorRole,
          characterAvatar: story?.narratorAvatar,
          voiceName,
          greeting: story?.characterGreeting || `¡Bienvenido a ${poi?.name}!`,
        })
      );

      clientWs.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.type === 'audio' && parsed.audio) {
            liveSession.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (parsed.type === 'text' && parsed.text) {
            liveSession.sendRealtimeInput({
              text: parsed.text,
            });
          }
        } catch (err) {
          console.error('Error sending input to Gemini Live:', err);
        }
      });

      clientWs.on('close', () => {
        try {
          liveSession.close();
        } catch (e) {}
      });
    } catch (err: any) {
      console.error('Failed to connect to Gemini 3.8 Live API:', err);
      clientWs.send(
        JSON.stringify({
          type: 'error',
          message: 'Error al iniciar sesión de voz en directo con el personaje: ' + err.message,
        })
      );
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Mount Vite middlewares in development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Enigma del Bosque server + Gemini Live WebSocket running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
