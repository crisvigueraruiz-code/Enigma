import { DuelMatch, DuelTeam, DuelEvent } from '../types';

type DuelListener = (match: DuelMatch) => void;
type EventListener = (event: DuelEvent) => void;
type ActionEffectListener = (effect: { type: 'fog' | 'whisper' | 'echo'; sourceTeamName: string }) => void;

class DuelService {
  private socket: WebSocket | null = null;
  private currentMatch: DuelMatch | null = null;
  private currentTeamId: string | null = null;
  private listeners: Set<DuelListener> = new Set();
  private eventListeners: Set<EventListener> = new Set();
  private actionListeners: Set<ActionEffectListener> = new Set();
  private reconnectTimer: any = null;
  private pollInterval: any = null;
  private isConnecting: boolean = false;

  constructor() {
    // Restore session if exists
    try {
      const saved = localStorage.getItem('enigma_active_duel');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.matchCode && parsed?.teamId) {
          this.currentTeamId = parsed.teamId;
        }
      }
    } catch {}
  }

  public getCurrentMatch(): DuelMatch | null {
    return this.currentMatch;
  }

  public getCurrentTeamId(): string | null {
    return this.currentTeamId;
  }

  public subscribe(listener: DuelListener): () => void {
    this.listeners.add(listener);
    if (this.currentMatch) {
      listener(this.currentMatch);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onEvent(listener: EventListener): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  public onActionEffect(listener: ActionEffectListener): () => void {
    this.actionListeners.add(listener);
    return () => {
      this.actionListeners.delete(listener);
    };
  }

  private notifyMatch(match: DuelMatch) {
    this.currentMatch = match;
    this.listeners.forEach((l) => l(match));
  }

  private notifyEvent(event: DuelEvent) {
    this.eventListeners.forEach((l) => l(event));
  }

  private notifyActionEffect(effect: { type: 'fog' | 'whisper' | 'echo'; sourceTeamName: string }) {
    this.actionListeners.forEach((l) => l(effect));
  }

  // Connect to WebSocket room
  public connect(matchCode: string, teamId: string) {
    this.currentTeamId = teamId;
    localStorage.setItem('enigma_active_duel', JSON.stringify({ matchCode, teamId }));

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
      const wsUrl = `${wsProtocol}//${host}/duel?matchCode=${encodeURIComponent(matchCode)}&teamId=${encodeURIComponent(teamId)}`;

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnecting = false;
        // Request initial match state
        this.socket?.send(JSON.stringify({ type: 'subscribe', matchCode, teamId }));
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'duel:init' || data.type === 'duel:update') {
            if (data.match) {
              this.notifyMatch(data.match);
            }
            if (data.event) {
              this.notifyEvent(data.event);
            }
          } else if (data.type === 'duel:action_received') {
            if (data.targetTeamId === this.currentTeamId) {
              this.notifyActionEffect({
                type: data.actionType,
                sourceTeamName: data.sourceTeamName || 'Equipo Rival',
              });
            }
          }
        } catch (e) {
          console.error('Error handling duel socket message:', e);
        }
      };

      this.socket.onclose = () => {
        this.isConnecting = false;
        this.socket = null;
        // Schedule auto-reconnect
        if (this.currentMatch && this.currentMatch.status !== 'finished') {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = setTimeout(() => {
            this.connect(matchCode, teamId);
          }, 3000);
        }
      };

      this.socket.onerror = () => {
        this.isConnecting = false;
      };
    } catch (e) {
      this.isConnecting = false;
    }

    // Start fallback periodic HTTP poll every 10s to guarantee state synchronization
    if (!this.pollInterval) {
      this.pollInterval = setInterval(async () => {
        if (matchCode) {
          try {
            const res = await fetch(`/api/duels/${matchCode}`);
            if (res.ok) {
              const data = await res.json();
              if (data.match) {
                this.notifyMatch(data.match);
              }
            }
          } catch {}
        }
      }, 10000);
    }
  }

  public disconnect() {
    clearTimeout(this.reconnectTimer);
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.currentMatch = null;
    this.currentTeamId = null;
    localStorage.removeItem('enigma_active_duel');
  }

  // Send team coordinates
  public sendLocation(lat: number, lng: number) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'duel:move',
          matchCode: this.currentMatch?.code,
          teamId: this.currentTeamId,
          lat,
          lng,
        })
      );
    }
  }

  // Trigger duel tactical powerup
  public async triggerAction(actionType: 'fog' | 'whisper' | 'echo'): Promise<{ success: boolean; message?: string }> {
    if (!this.currentMatch || !this.currentTeamId) {
      return { success: false, message: 'Duelo no activo' };
    }

    try {
      const res = await fetch(`/api/duels/${this.currentMatch.code}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: this.currentTeamId,
          actionType,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        return { success: false, message: err.error || 'Error al ejecutar acción' };
      }

      const data = await res.json();
      if (data.match) {
        this.notifyMatch(data.match);
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  // REST API Methods
  public async createMatch(params: {
    forestPackId: string;
    storyId: string;
    teamName: string;
    emblem: string;
    color: string;
    includeShadowRival?: boolean;
    language?: string;
  }): Promise<{ match: DuelMatch; team: DuelTeam; sessionCode: string }> {
    const res = await fetch('/api/duels/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al crear duelo');
    }

    const data = await res.json();
    this.currentMatch = data.match;
    this.currentTeamId = data.team.id;
    this.connect(data.match.code, data.team.id);
    return data;
  }

  public async joinMatch(params: {
    code: string;
    teamName: string;
    emblem: string;
    color: string;
    language?: string;
  }): Promise<{ match: DuelMatch; team: DuelTeam; sessionCode: string }> {
    const res = await fetch('/api/duels/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al unirse al duelo');
    }

    const data = await res.json();
    this.currentMatch = data.match;
    this.currentTeamId = data.team.id;
    this.connect(data.match.code, data.team.id);
    return data;
  }

  public async getMatch(code: string): Promise<DuelMatch> {
    const res = await fetch(`/api/duels/${code}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Duelo no encontrado');
    }
    const data = await res.json();
    this.notifyMatch(data.match);
    return data.match;
  }
}

export const duelService = new DuelService();
