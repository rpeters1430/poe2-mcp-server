import { CharacterStats } from '../types';
import { ShieldAlert, Terminal, Sparkles, RefreshCw, Download, Info } from 'lucide-react';

interface HeaderProps {
  characters: CharacterStats[];
  activeCharacter: CharacterStats | null;
  onSelectCharacter: (id: string) => void;
  onRefresh: () => void;
  onOpenSafetyModal: () => void;
  onDownloadMcp: () => void;
  loading: boolean;
}

export default function Header({
  characters,
  activeCharacter,
  onSelectCharacter,
  onRefresh,
  onOpenSafetyModal,
  onDownloadMcp,
  loading
}: HeaderProps) {
  return (
    <header className="border-b border-amber-950/40 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-xl shadow-black/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 p-[1px] shadow-lg shadow-amber-900/30 flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-lg flex items-center justify-center text-amber-400 font-bold text-lg tracking-wider">
              Ω
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                PoE2 AI Companion <span className="text-xs px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/60 text-amber-300 font-medium">MCP Server</span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400">
              Live Path of Exile 2 Character, Inventory & Log Stream for AI Models (Codex CLI, Claude, Gemini)
            </p>
          </div>
        </div>

        {/* Status Indicators & Character Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Character Picker */}
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300">
            <span className="text-zinc-500 font-medium">Character:</span>
            <select
              id="character-selector"
              value={activeCharacter?.id || ''}
              onChange={(e) => onSelectCharacter(e.target.value)}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer pr-2"
            >
              {characters.map((c) => (
                <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-200">
                  {c.name} (Lv {c.level} {c.characterClass})
                </option>
              ))}
            </select>
          </div>

          {/* Status Pills */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MCP Protocol: Active</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Client.txt Stream</span>
          </div>

          {/* Action Buttons */}
          <button
            id="safety-advisory-btn"
            onClick={onOpenSafetyModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-xs text-red-300 hover:bg-red-900/40 hover:text-red-200 transition-colors"
            title="Read GGG ToS & Memory Reading vs Compliant MCP Architecture Guide"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden lg:inline">Safety & ToS Guide</span>
            <span className="lg:hidden">ToS Guide</span>
          </button>

          <button
            id="download-mcp-btn"
            onClick={onDownloadMcp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-zinc-950 font-semibold text-xs transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export MCP Server</span>
          </button>

          <button
            id="refresh-btn"
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            title="Refresh game snapshot"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
