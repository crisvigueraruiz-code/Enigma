import React, { useState } from 'react';
import { PlayerSession, ForestPack, BackpackItem, ItemCategory } from '../types';
import { STARTER_BACKPACK_ITEMS, CRAFTING_RECIPES } from '../data/backpackArtifacts';
import { sounds } from '../utils/audio';
import { useI18n } from '../context/I18nContext';
import {
  Briefcase,
  Sparkles,
  Search,
  X,
  Compass,
  Scroll,
  Wrench,
  HelpCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Flame,
  Info,
} from 'lucide-react';

interface ExpeditionBackpackModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: PlayerSession | null;
  forest?: ForestPack | null;
  onUpdateInventory?: (newInventory: BackpackItem[]) => void;
}

export const ExpeditionBackpackModal: React.FC<ExpeditionBackpackModalProps> = ({
  isOpen,
  onClose,
  session,
  forest,
  onUpdateInventory,
}) => {
  const { t } = useI18n();

  // Get current inventory or fallback to starter kit
  const rawInventory = session?.inventory && session.inventory.length > 0
    ? session.inventory
    : STARTER_BACKPACK_ITEMS;

  const [inventory, setInventory] = useState<BackpackItem[]>(rawInventory);
  const [selectedItem, setSelectedItem] = useState<BackpackItem | null>(rawInventory[0] || null);
  const [activeCategory, setActiveCategory] = useState<'all' | ItemCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [combineMode, setCombineMode] = useState<boolean>(false);
  const [combineTarget, setCombineTarget] = useState<BackpackItem | null>(null);
  const [craftCelebration, setCraftCelebration] = useState<BackpackItem | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Sync inventory whenever modal opens or session inventory updates
  React.useEffect(() => {
    if (isOpen) {
      const current = session?.inventory && session.inventory.length > 0
        ? session.inventory
        : STARTER_BACKPACK_ITEMS;
      setInventory(current);
      if (!selectedItem || !current.some((it) => it.id === selectedItem.id)) {
        setSelectedItem(current[0] || null);
      }
    }
  }, [isOpen, session?.inventory]);

  if (!isOpen) return null;

  // Filter items by category and search
  const filteredItems = inventory.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lore.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUseItemInField = (item: BackpackItem) => {
    sounds.playHintChime();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    let feedback = `Has utilizado ${item.name} en el sendero.`;
    if (item.category === 'tool') {
      feedback = `🔧 Has activado ${item.name}: La herramienta está lista para superar cualquier desafío del bosque.`;
    } else if (item.category === 'relic') {
      feedback = `🏺 Reverencias la reliquia «${item.name}»: Su memoria histórica resuena con la senda.`;
    } else if (item.category === 'document') {
      feedback = `📜 Despliegas ${item.name}: Repasas con atención las anotaciones y marcas cartográficas.`;
    } else if (item.category === 'curio') {
      feedback = `🌰 Sostienes en tu mano ${item.name}: El vestigio natural reconecta tu expedición con el monte.`;
    }

    setActionFeedback(feedback);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleSelectItem = (item: BackpackItem) => {
    sounds.playClick();
    setSelectedItem(item);
    setInspectMode(false);
    setCombineMode(false);
    setCombineTarget(null);
  };

  const handleInspect = () => {
    if (!selectedItem) return;
    sounds.playHintChime();
    setInspectMode(true);

    // Mark as inspected in state
    const updated = inventory.map((it) =>
      it.id === selectedItem.id ? { ...it, isInspected: true } : it
    );
    setInventory(updated);
    setSelectedItem({ ...selectedItem, isInspected: true });
    if (onUpdateInventory) onUpdateInventory(updated);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
  };

  const handleStartCombine = () => {
    sounds.playClick();
    setCombineMode(!combineMode);
    setCombineTarget(null);
  };

  const handleExecuteCombine = (secondaryItem: BackpackItem) => {
    if (!selectedItem) return;

    // Check recipe match
    const recipe = CRAFTING_RECIPES.find(
      (r) =>
        (r.itemA === selectedItem.id && r.itemB === secondaryItem.id) ||
        (r.itemA === secondaryItem.id && r.itemB === selectedItem.id)
    );

    if (recipe) {
      sounds.playSuccess();
      const crafted: BackpackItem = {
        ...recipe.result,
        acquiredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Remove both combined items and add crafted
      const newInv = inventory.filter(
        (it) => it.id !== selectedItem.id && it.id !== secondaryItem.id
      );
      newInv.unshift(crafted);

      setInventory(newInv);
      setSelectedItem(crafted);
      setCombineMode(false);
      setCombineTarget(null);
      setCraftCelebration(crafted);
      if (onUpdateInventory) onUpdateInventory(newInv);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([150, 70, 250]);
      }
    } else {
      sounds.playError();
    }
  };

  const getCategoryLabel = (cat: ItemCategory) => {
    switch (cat) {
      case 'tool':
        return 'Herramienta';
      case 'relic':
        return 'Reliquia de Hito';
      case 'document':
        return 'Manuscrito / Plano';
      case 'curio':
        return 'Curiosidad Natural';
      default:
        return 'Objeto';
    }
  };

  const getCategoryBadgeClass = (cat: ItemCategory) => {
    switch (cat) {
      case 'tool':
        return 'bg-amber-950/60 border-amber-600/40 text-amber-300';
      case 'relic':
        return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
      case 'document':
        return 'bg-blue-950/60 border-blue-600/40 text-blue-300';
      case 'curio':
        return 'bg-purple-950/60 border-purple-500/40 text-purple-300';
      default:
        return 'bg-stone-900 border-stone-700 text-stone-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#142217] border border-amber-600/40 rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        {/* Leather Satchel Decorative Header */}
        <div className="relative bg-gradient-to-r from-[#1b2b1e] via-[#223626] to-[#1a291d] px-5 sm:px-7 py-4 border-b border-amber-600/30 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600/30 to-amber-900/40 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-inner">
              <Briefcase className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Equipo de Campo & Reliquias</span>
              </div>
              <h2 className="font-adventure text-lg sm:text-2xl font-bold text-amber-100">
                Mochila de Expedición
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-mono px-2.5 py-1 rounded-xl bg-black/40 border border-emerald-800/60 text-emerald-300">
              {inventory.length} {inventory.length === 1 ? 'objeto' : 'objetos'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-stone-700 hover:border-amber-400/50 text-stone-300 hover:text-white transition-all cursor-pointer"
              title="Cerrar mochila"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters & Search Bar */}
        <div className="px-5 py-2.5 bg-[#0f1a11] border-b border-emerald-950 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-emerald-950/40'
              }`}
            >
              Todos ({inventory.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('relic')}
              className={`px-3 py-1 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeCategory === 'relic'
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-emerald-950/40'
              }`}
            >
              🏺 Reliquias
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('tool')}
              className={`px-3 py-1 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeCategory === 'tool'
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-emerald-950/40'
              }`}
            >
              🔍 Herramientas
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('document')}
              className={`px-3 py-1 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeCategory === 'document'
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-emerald-950/40'
              }`}
            >
              📜 Manuscritos
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('curio')}
              className={`px-3 py-1 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeCategory === 'curio'
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-emerald-950/40'
              }`}
            >
              🌰 Curiosidades
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-48 shrink-0">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en zurrón..."
              className="w-full pl-8 pr-2.5 py-1 rounded-xl bg-black/40 border border-emerald-900/80 text-[11px] text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Main Backpack Content Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column: Satchel Compartments & Items Grid */}
          <div className="md:col-span-6 lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-mono uppercase tracking-wider text-[11px] text-amber-300">
                Compartimentos del Zurrón
              </span>
              <span>Selecciona un objeto para examinarlo</span>
            </div>

            {/* Inventory Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isEligibleRecipe =
                  combineMode &&
                  selectedItem &&
                  CRAFTING_RECIPES.some(
                    (r) =>
                      (r.itemA === selectedItem.id && r.itemB === item.id) ||
                      (r.itemA === item.id && r.itemB === selectedItem.id)
                  );

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (combineMode && selectedItem && isEligibleRecipe) {
                        handleExecuteCombine(item);
                      } else {
                        handleSelectItem(item);
                      }
                    }}
                    className={`relative p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-900/60 border-amber-400 shadow-lg shadow-emerald-950/80 ring-2 ring-amber-400/30'
                        : isEligibleRecipe
                        ? 'bg-amber-950/80 border-amber-400 animate-pulse ring-2 ring-amber-500'
                        : 'bg-[#18261b]/80 hover:bg-[#203324] border-emerald-800/40 hover:border-emerald-600/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 w-full">
                      <div className="w-10 h-10 rounded-xl bg-black/40 border border-emerald-900/60 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        {item.iconEmoji}
                      </div>
                      {item.isInspected && (
                        <span
                          className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm"
                          title="Examinado con éxito"
                        />
                      )}
                    </div>

                    <div className="mt-2 min-w-0">
                      <div className="font-adventure text-xs font-bold text-stone-200 group-hover:text-amber-100 line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                        {item.shortDesc}
                      </div>
                    </div>

                    {isEligibleRecipe && combineMode && (
                      <div className="absolute inset-0 bg-amber-600/20 backdrop-blur-xs rounded-2xl border-2 border-amber-400 flex items-center justify-center text-xs font-adventure font-black text-amber-200">
                        ⚡ ¡Combinar!
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Decorative Empty Slots */}
              {Array.from({ length: Math.max(0, 6 - filteredItems.length) }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="rounded-2xl border border-dashed border-emerald-900/30 bg-black/20 p-3.5 flex flex-col items-center justify-center text-center min-h-[115px] text-stone-600"
                >
                  <span className="text-xl opacity-30">🪢</span>
                  <span className="text-[10px] font-mono mt-1">Hueco libre</span>
                </div>
              ))}
            </div>

            {/* Hint Notice */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-900/50 flex items-start gap-2.5 text-xs text-stone-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                Los hitos del bosque custodian reliquias históricas y naturales. Al llegar a un punto marcado o resolver su enigma, se guardarán automáticamente en tu zurrón.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Examination & Crafting Panel */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between bg-[#18271C]/90 rounded-2xl border border-emerald-700/40 p-4 sm:p-5 shadow-xl">
            {selectedItem ? (
              <div className="space-y-4">
                {/* Item Header */}
                <div className="flex items-start gap-3.5 pb-3 border-b border-emerald-900/60">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600/20 to-emerald-950/60 border border-amber-500/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {selectedItem.iconEmoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border mb-1 ${getCategoryBadgeClass(
                        selectedItem.category
                      )}`}
                    >
                      {getCategoryLabel(selectedItem.category)}
                    </span>
                    <h3 className="font-adventure text-base sm:text-lg font-bold text-amber-100 leading-tight">
                      {selectedItem.name}
                    </h3>
                    {selectedItem.foundAtPoiName && (
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Compass className="w-3 h-3 text-emerald-400" />
                        <span>Hallado en: {selectedItem.foundAtPoiName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Lore Narrative Description */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80 font-mono">
                    Bitácora del Vestigio
                  </span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-serif italic bg-black/30 p-3 rounded-xl border border-emerald-900/50">
                    "{selectedItem.lore}"
                  </p>
                </div>

                {/* Secret Inspection Result Scroll */}
                {(inspectMode || selectedItem.isInspected) && selectedItem.inspectClue && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/50 via-[#262015] to-amber-950/40 border border-amber-500/60 text-amber-100 text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-200 shadow-md">
                    <div className="flex items-center gap-1.5 font-adventure font-bold text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Detalle Oculto Descubierto:</span>
                    </div>
                    <p className="leading-relaxed font-mono text-[11px] text-amber-200">
                      {selectedItem.inspectClue}
                    </p>
                  </div>
                )}

                {/* Crafting / Combine Prompt */}
                {combineMode && (
                  <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 text-xs text-amber-200 space-y-1 animate-pulse">
                    <div className="font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Modo Alquimia & Combinación</span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Pulsa sobre otro objeto compatible de tu zurrón para unirlos y forjar un nuevo artefacto.
                    </p>
                  </div>
                )}

                {/* Action Feedback Toast */}
                {actionFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-xs text-emerald-200 animate-in fade-in zoom-in-95 duration-200 shadow-lg">
                    <p className="leading-relaxed font-sans">{actionFeedback}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  {/* Usar en Terreno */}
                  <button
                    type="button"
                    onClick={() => handleUseItemInField(selectedItem)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-800/80 to-teal-800/80 hover:from-emerald-700 hover:to-teal-700 border border-emerald-500/40 text-stone-100 font-adventure text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{selectedItem.iconEmoji}</span>
                    <span>Probar / Usar en el Sendero</span>
                  </button>

                  {selectedItem.canInspect && !inspectMode && !selectedItem.isInspected && (
                    <button
                      type="button"
                      onClick={handleInspect}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-600 hover:to-green-500 text-white font-adventure text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow active:scale-95 transition-all cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-emerald-200" />
                      <span>Examinar con Lupa de Campo</span>
                    </button>
                  )}

                  {CRAFTING_RECIPES.some(
                    (r) => r.itemA === selectedItem.id || r.itemB === selectedItem.id
                  ) && (
                    <button
                      type="button"
                      onClick={handleStartCombine}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold font-adventure tracking-wider flex items-center justify-center gap-2 shadow active:scale-95 transition-all cursor-pointer ${
                        combineMode
                          ? 'bg-amber-600 text-stone-950 border-amber-400'
                          : 'bg-amber-950/70 hover:bg-amber-900 border-amber-600/50 text-amber-200 hover:text-white'
                      }`}
                    >
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>{combineMode ? 'Cancelar Combinación' : 'Combinar con otro Objeto'}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <Briefcase className="w-12 h-12 text-stone-600 mb-2" />
                <p className="text-xs">Selecciona un objeto para ver su historia</p>
              </div>
            )}
          </div>
        </div>

        {/* Crafting Success Modal Overlay */}
        {craftCelebration && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
            <div className="max-w-md w-full bg-[#1A281E] border-2 border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 mx-auto flex items-center justify-center text-3xl shadow-inner">
                {craftCelebration.iconEmoji}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
                  ¡Alquimia de Expedición Exitosa!
                </span>
                <h3 className="font-adventure text-xl font-bold text-amber-100">
                  {craftCelebration.name}
                </h3>
                <p className="text-xs text-stone-300 italic font-serif">
                  "{craftCelebration.lore}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCraftCelebration(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-adventure text-xs font-bold tracking-wider active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                Guardar en la Mochila
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
