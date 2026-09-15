import { ShieldAlert, ShieldCheck, X, AlertTriangle, Terminal, Code, Cpu } from 'lucide-react';

interface SafetyAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafetyAdvisoryModal({ isOpen, onClose }: SafetyAdvisoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-amber-900/60 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 text-xs text-zinc-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">
                PoE2 Integration Architecture & Anti-Cheat Compliance
              </h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Understanding Memory Reading vs. Compliant MCP & Official APIs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Callout: Memory Reading Risks */}
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Why Direct Process Memory Reading is Prohibited</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Directly scanning or hooking game process memory (e.g., via WinAPI <code>OpenProcess</code>, <code>ReadProcessMemory</code>, or DLL injection) violates <strong>Grinding Gear Games (GGG) Terms of Service</strong>. PoE2 uses anti-cheat mechanisms (Easy Anti-Cheat and proprietary server heuristics) that detect unauthorized memory handles and issue <strong>permanent account bans</strong>. In addition, memory pointers shift on every minor hotfix, causing memory-based tools to crash.
          </p>
        </div>

        {/* The Safe, 100% Compliant Alternative (What This App Implements) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            The Compliant & Industry-Standard Architecture
          </h4>
          <p className="text-zinc-400">
            Legitimate community tools (such as Awakened PoE Trade, Path of Building, and Exilence) achieve full real-time character and inventory tracking using three safe, ToS-compliant channels:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-amber-400" />
                1. Client.txt Stream
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                PoE2 actively appends zone changes, party interactions, instance IDs, trade messages, and boss events to <code>logs/Client.txt</code> on disk. Tailing this file runs completely in userland with <strong>zero process interaction</strong> and 0% ban risk.
              </p>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-cyan-400" />
                2. Official PoE2 API
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Grinding Gear Games provides official REST API endpoints (<code>api.pathofexile.com/character</code>) with OAuth2. This provides 100% accurate JSON representations of your character, inventory, runes, and socketed gems.
              </p>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                3. Model Context Protocol
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                The MCP server packages these official data streams into standard JSON-RPC 2.0 tools that Codex CLI, Claude Desktop, and Gemini can invoke seamlessly on your local machine.
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition"
          >
            I Understand — Proceed to Studio
          </button>
        </div>
      </div>
    </div>
  );
}
