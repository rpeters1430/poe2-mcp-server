import { useState } from 'react';
import { GameLogEntry } from '../types';
import { Terminal, ShieldCheck, Play, PlusCircle, CheckCircle2, AlertCircle, Compass, Trophy } from 'lucide-react';

interface LogWatcherProps {
  logs: GameLogEntry[];
  onAddSimulatedEvent: (type: 'area' | 'boss' | 'item' | 'death' | 'level', message: string, detail?: string) => void;
}

export default function LogWatcher({ logs, onAddSimulatedEvent }: LogWatcherProps) {
  const [selectedEventType, setSelectedEventType] = useState<'area' | 'boss' | 'item' | 'death' | 'level'>('boss');

  const triggerPresetEvent = (type: 'area' | 'boss' | 'item' | 'death' | 'level') => {
    switch (type) {
      case 'boss':
        onAddSimulatedEvent('boss', 'Encounter: The Devourer of Sins (Pinnacle Boss)', 'Phase 2: Magma Pool & Ground Eruption active');
        break;
      case 'item':
        onAddSimulatedEvent('item', 'High-Tier Drop: Mirror of Kalandra & Tier 19 Uncut Skill Gem', 'Value Rating: Pinnacle S-Tier Loot Drop');
        break;
      case 'area':
        onAddSimulatedEvent('area', 'Entered Area: Sunken Temple of Utzaal (Tier 12 Waystone)', 'Affixes: +35% Monster Damage, Elemental Weakness');
        break;
      case 'level':
        onAddSimulatedEvent('level', 'Character Leveled Up: Reached Level 80!', 'Unlocked 1 Passive Skill Point and +5 Base Spirit');
        break;
      case 'death':
        onAddSimulatedEvent('death', 'Resurrected at Checkpoint after fatal blow', 'Cause: Volatile Flameblood explosion in Ogham Highlands');
        break;
    }
  };

  const getLogBadge = (type: string) => {
    switch (type) {
      case 'boss':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">BOSS</span>;
      case 'item':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">LOOT</span>;
      case 'area':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">ZONE</span>;
      case 'death':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">DEATH</span>;
      case 'level':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">PROGRESS</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">LOG</span>;
    }
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header & Architecture Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-zinc-100">Live Client.txt Log Streamer (Anti-Cheat Safe)</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Streams real-time game events by tailing Path of Exile 2's official <code>logs/Client.txt</code> on your machine. This provides instant event tracking without process memory injection or anti-cheat triggers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% GGG ToS Compliant</span>
          </div>
        </div>
      </div>

      {/* Quick Event Simulation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/70 p-3 rounded-lg border border-zinc-800/80">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Simulate Real-Time Event:</span>
          <span className="text-[11px] text-zinc-500">(Triggers live MCP tool updates & AI context)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerPresetEvent('boss')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60 text-xs transition"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Engage Boss</span>
          </button>
          <button
            onClick={() => triggerPresetEvent('item')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 text-xs transition"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Loot Drop</span>
          </button>
          <button
            onClick={() => triggerPresetEvent('area')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-800/60 text-xs transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Zone Transition</span>
          </button>
          <button
            onClick={() => triggerPresetEvent('level')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 text-xs transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Level Up</span>
          </button>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="bg-black/90 rounded-lg p-3.5 border border-zinc-800 font-mono text-xs space-y-2 max-h-72 overflow-y-auto">
        <div className="text-zinc-600 text-[11px] pb-1 border-b border-zinc-900 flex justify-between">
          <span>// Tail stream: C:\Program Files (x86)\Grinding Gear Games\Path of Exile 2\logs\Client.txt</span>
          <span className="text-emerald-500 font-sans font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Listening
          </span>
        </div>

        {logs.map((log) => (
          <div key={log.id} className="flex flex-col sm:flex-row sm:items-baseline gap-2 py-1 text-zinc-300 hover:bg-zinc-900/50 px-1.5 rounded transition">
            <span className="text-zinc-500 text-[11px] whitespace-nowrap">{log.timestamp}</span>
            <div className="flex items-center gap-1.5">{getLogBadge(log.type)}</div>
            <div className="flex-1">
              <span className="text-zinc-200 font-medium">{log.message}</span>
              {log.detail && (
                <span className="text-zinc-400 text-[11px] block sm:inline sm:ml-2">
                  &bull; {log.detail}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
