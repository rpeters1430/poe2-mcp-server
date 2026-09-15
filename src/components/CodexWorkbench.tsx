import { useState, useEffect } from 'react';
import {
  CharacterStats,
  CodexTelemetryPacket,
  CodexActionEnvelope,
  CodexDispatchResult
} from '../types';
import CanonicalToolsTab from './CanonicalToolsTab';
import AdvisoryDispatcherTab from './AdvisoryDispatcherTab';
import {
  Terminal,
  Play,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Flame,
  Volume2,
  FileText,
  Search,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Bell,
  Wrench
} from 'lucide-react';

interface CodexWorkbenchProps {
  character: CharacterStats;
  onDispatchActionToHud: (actions: CodexActionEnvelope[]) => void;
  onDownloadScript: () => void;
}

export default function CodexWorkbench({
  character,
  onDispatchActionToHud,
  onDownloadScript
}: CodexWorkbenchProps) {
  const [promptInput, setPromptInput] = useState(
    'Evaluate pinnacle boss encounter and emit phase 2 tactical audio and HUD cues.'
  );
  const [activeSubTab, setActiveSubTab] = useState<
    'runner' | 'tools' | 'advisory' | 'protocol_spec' | 'cli_setup'
  >('runner');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] = useState<CodexDispatchResult | null>(null);
  const [liveTelemetry, setLiveTelemetry] = useState<CodexTelemetryPacket | null>(null);

  // Load initial telemetry snapshot
  const loadTelemetry = async () => {
    try {
      const res = await fetch('/api/codex/telemetry');
      const data = await res.json();
      setLiveTelemetry(data);
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    }
  };

  useEffect(() => {
    loadTelemetry();
  }, [character]);

  const handleRunDispatch = async (overridePrompt?: string) => {
    const textToRun = overridePrompt || promptInput;
    if (!textToRun.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/codex/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToRun,
          triggerType: 'USER_INPUT',
          triggerEvent: 'CODEX_CLI_RUN'
        })
      });

      const data: CodexDispatchResult = await res.json();
      setDispatchResult(data);
      if (data.outboundTelemetry) {
        setLiveTelemetry(data.outboundTelemetry);
      }

      // Propagate interpreted actions to the in-game HUD overlay
      if (data.actionEnvelopes && data.actionEnvelopes.length > 0) {
        onDispatchActionToHud(data.actionEnvelopes);
      }
    } catch (err) {
      console.error('Failed to dispatch Codex command:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const quickPresets = [
    {
      label: 'Boss Encounter Alert',
      prompt: 'Evaluate pinnacle boss encounter and emit phase 2 tactical audio and HUD cues.',
      tag: 'Combat HUD'
    },
    {
      label: 'Stash Search Regex',
      prompt: 'Find best weapon upgrades in stash and generate a regex search string.',
      tag: 'Stash Regex'
    },
    {
      label: 'Test GGG ToS Gatekeeper',
      prompt: 'Set up an auto-drink life flask macro when character health drops under 30%.',
      tag: 'ToS Interceptor'
    },
    {
      label: 'Zone Warp & Remaining',
      prompt: 'Prepare compliant /remaining and /hideout macros for quick clearance.',
      tag: '1:1 Macro'
    }
  ];

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-5 shadow-lg space-y-5">
      {/* GitHub Repository Reference Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-cyan-950/30 border border-amber-800/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-zinc-100">
                rpeters1430/poe2-mcp
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                Advisory-Only Architecture
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                GGG ToS Compliant
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Aligned with canonical repo: zero memory hooks, read-only telemetry, and non-intrusive player advisory sidechannels.
            </p>
          </div>
        </div>
        <a
          href="https://github.com/rpeters1430/poe2-mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold self-start sm:self-auto transition border border-zinc-700"
        >
          <span>GitHub Repo</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Top Bar Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-zinc-100">
              Codex CLI & MCP Protocol Workbench
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              poe2-mcp-codex/v1
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Bidirectional communication bridge connecting the local PoE2 MCP Server to Codex CLI. Automatically sends game state telemetry and safely interprets return actions via GGG ToS §7 filters.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('runner')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'runner'
                ? 'bg-amber-600 text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>CLI Runner</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tools')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'tools'
                ? 'bg-amber-600 text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Canonical Tools (20)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('advisory')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'advisory'
                ? 'bg-amber-600 text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Emit Advisory</span>
          </button>

          <button
            onClick={() => setActiveSubTab('protocol_spec')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'protocol_spec'
                ? 'bg-amber-600 text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protocol Spec</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cli_setup')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'cli_setup'
                ? 'bg-amber-600 text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Integration Configs</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Live CLI Runner */}
      {activeSubTab === 'runner' && (
        <div className="space-y-5">
          {/* Preset Prompts */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Codex CLI Quick Scenarios:
            </span>
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptInput(preset.prompt);
                  handleRunDispatch(preset.prompt);
                }}
                disabled={loading}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 flex items-center gap-1.5 transition"
              >
                <span className="text-[10px] text-amber-400 font-semibold">{preset.tag}</span>
                <span>&bull;</span>
                <span className="truncate max-w-[180px]">{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Interactive Command Terminal */}
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono flex items-center gap-1.5 text-amber-300 font-semibold">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>codex --mcp-server &quot;poe2-mcp-server&quot; --prompt</span>
              </span>
              <span className="text-[11px] text-zinc-500">
                Target: {character.name} (Lvl {character.level} {character.characterClass})
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Enter prompt for Codex CLI..."
                disabled={loading}
                className="flex-1 bg-black text-zinc-100 font-mono text-xs px-3.5 py-2.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleRunDispatch()}
                disabled={loading || !promptInput.trim()}
                className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-2 transition shadow-md shadow-amber-950/40"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Transmitting...' : 'Dispatch Packet'}</span>
              </button>
            </div>
          </div>

          {/* Dual-Pane Protocol Frame Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Pane: Outbound Telemetry Frame (Server -> Codex CLI) */}
            <div className="lg:col-span-6 bg-zinc-950/90 rounded-xl p-4 border border-zinc-800 flex flex-col min-h-[440px]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                    <span>1. Outbound State Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px] text-zinc-400">Codex CLI</span>
                  </span>
                </div>
                {liveTelemetry && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(liveTelemetry, null, 2), 'telemetry')}
                    className="text-zinc-400 hover:text-zinc-200 text-[11px] flex items-center gap-1"
                  >
                    {copiedKey === 'telemetry' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'telemetry' ? 'Copied' : 'Copy Frame'}</span>
                  </button>
                )}
              </div>

              {liveTelemetry ? (
                <div className="flex-1 flex flex-col justify-between overflow-auto space-y-3 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] space-y-1">
                    <div className="text-zinc-400 flex justify-between">
                      <span>Packet ID:</span>
                      <span className="text-amber-400">{liveTelemetry.packetId || liveTelemetry.sessionId}</span>
                    </div>
                    <div className="text-zinc-400 flex justify-between">
                      <span>Character:</span>
                      <span className="text-zinc-200">
                        {liveTelemetry.gameState?.character?.name || 'Unknown'} (Lvl {liveTelemetry.gameState?.character?.level || '?'})
                      </span>
                    </div>
                    <div className="text-zinc-400 flex justify-between">
                      <span>Location:</span>
                      <span className="text-cyan-300">{liveTelemetry.gameState?.character?.currentArea || 'Unknown'}</span>
                    </div>
                    <div className="text-zinc-400 flex justify-between">
                      <span>Combat Status:</span>
                      <span className={liveTelemetry.gameState?.combat?.inCombat ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {liveTelemetry.gameState?.combat?.inCombat ? 'IN COMBAT' : 'OUT OF COMBAT'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 bg-black/90 p-3 rounded-lg border border-zinc-800/80 overflow-auto max-h-[300px] text-[11px] text-zinc-300">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(liveTelemetry, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center flex-1 text-zinc-500 text-xs">
                  Loading game state telemetry...
                </div>
              )}
            </div>

            {/* Right Pane: Inbound Action Frame & ToS Audit (Codex CLI -> Server -> HUD) */}
            <div className="lg:col-span-6 bg-zinc-950/90 rounded-xl p-4 border border-zinc-800 flex flex-col min-h-[440px]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <span>2. Inbound AI Actions & GGG Audit</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px] text-zinc-400">Codex CLI</span>
                  </span>
                </div>
                {dispatchResult && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(dispatchResult, null, 2), 'response')}
                    className="text-zinc-400 hover:text-zinc-200 text-[11px] flex items-center gap-1"
                  >
                    {copiedKey === 'response' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'response' ? 'Copied' : 'Copy Frame'}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center flex-1 text-zinc-400 gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <div className="text-xs">Processing prompt with Codex CLI / Gemini...</div>
                  <div className="text-[11px] text-zinc-500 font-mono">Running ToS §7 Safety Gatekeeper checks</div>
                </div>
              ) : dispatchResult ? (
                <div className="flex-1 flex flex-col justify-between overflow-auto space-y-3 font-mono text-xs">
                  {/* ToS Gatekeeper Summary Banner */}
                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-zinc-200">GGG Fair Play Gatekeeper:</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-400 font-bold">
                        {dispatchResult.tosSafetySummary?.compliantCount ?? (dispatchResult.actionEnvelopes?.filter(e => e.tosCompliant).length || 0)} Approved
                      </span>
                      {((dispatchResult.interceptedActions && dispatchResult.interceptedActions.length > 0) || (dispatchResult.tosSafetySummary?.blockedCount && dispatchResult.tosSafetySummary.blockedCount > 0)) ? (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>
                            {dispatchResult.interceptedActions?.length || dispatchResult.tosSafetySummary?.blockedCount} Blocked
                          </span>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Intercepted Actions Warning if any */}
                  {dispatchResult.interceptedActions && dispatchResult.interceptedActions.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/80 text-[11px] space-y-1">
                      <div className="font-bold text-red-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Forbidden Automation Intercepted:</span>
                      </div>
                      {dispatchResult.interceptedActions.map((int, i) => (
                        <div key={i} className="text-red-200/90 pl-5">
                          &bull; <strong>{int.rawType}</strong>: {int.reason} ({int.ruleViolation})
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Approved Action Envelopes List */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto">
                    {(dispatchResult.actionEnvelopes || []).map((env, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">{env.type}</span>
                          <span className="text-zinc-500 font-sans text-[11px] truncate max-w-[200px]">
                            {env.payload?.title || env.payload?.spokenText || env.payload?.macroText}
                          </span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                          {env.tosAudit?.status || (env.tosCompliant ? 'APPROVED' : 'BLOCKED')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Raw AI Explanation */}
                  <div className="bg-black/90 p-3 rounded-lg border border-zinc-800/80 max-h-[140px] overflow-auto text-[11px] text-zinc-300 font-sans leading-relaxed">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1 font-mono">
                      Codex CLI Narrative Rationale:
                    </div>
                    {dispatchResult.assistantNarrative || dispatchResult.playerMessage || dispatchResult.thoughtProcess}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-zinc-500 text-xs text-center p-6 space-y-2">
                  <Play className="w-8 h-8 text-zinc-700" />
                  <span>Click &quot;Dispatch Packet&quot; above to transmit game telemetry and receive ToS-audited HUD envelopes.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Canonical Tools Suite */}
      {activeSubTab === 'tools' && (
        <CanonicalToolsTab character={character} />
      )}

      {/* Sub-tab 3: Live Advisory Dispatcher */}
      {activeSubTab === 'advisory' && (
        <AdvisoryDispatcherTab onDispatchActionToHud={onDispatchActionToHud} />
      )}

      {/* Sub-tab 4: Protocol Specification */}
      {activeSubTab === 'protocol_spec' && (
        <div className="space-y-4 text-xs text-zinc-300">
          <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 space-y-2">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              The `poe2-mcp-codex/v1` Communication Protocol Specification
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              This protocol standardizes the exchange between the local Path of Exile 2 Model Context Protocol (MCP) server and AI command-line agents (like Codex CLI). It solves the fundamental problem of how an external AI can observe live game state and provide actionable game feedback while adhering 100% to Grinding Gear Games (GGG) Fair Play policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allowed Actions Matrix */}
            <div className="bg-zinc-950/80 p-4 rounded-xl border border-emerald-900/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Permitted Action Taxonomy (GGG ToS Compliant)</span>
              </div>
              <ul className="space-y-2 text-[11px] text-zinc-400">
                <li className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30">
                  <strong className="text-emerald-300 block">HUD_OVERLAY_NOTIFICATION</strong>
                  Non-intrusive transparent HUD overlay toasts/banners rendered outside the game window. Follows the exact model authorized for Awakened PoE Trade and LabCompass.
                </li>
                <li className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30">
                  <strong className="text-emerald-300 block">AUDIO_TACTICAL_CUE</strong>
                  Plays auditory chimes or text-to-speech cues (e.g. boss phase transition warnings) to the player headset. 100% external auditory assistance.
                </li>
                <li className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30">
                  <strong className="text-emerald-300 block">CLIPBOARD_ACTION_MACRO</strong>
                  Prepares 1-to-1 chat commands (<code>/remaining</code>, <code>/hideout</code>, trade whispers) directly in the OS clipboard for single manual player execution.
                </li>
                <li className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30">
                  <strong className="text-emerald-300 block">STASH_REGEX_FILTER</strong>
                  Generates regex search strings copied to clipboard so the player can paste into PoE2 stash search to highlight upgrades without manual sorting.
                </li>
              </ul>
            </div>

            {/* Forbidden Actions Matrix */}
            <div className="bg-zinc-950/80 p-4 rounded-xl border border-red-900/40 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Strictly Prohibited & Intercepted by Gatekeeper</span>
              </div>
              <ul className="space-y-2 text-[11px] text-zinc-400">
                <li className="p-2 rounded bg-red-950/20 border border-red-900/30">
                  <strong className="text-red-300 block">AUTO_FLASK_DRINKING</strong>
                  Automated reactive drinking of life or mana flasks based on health percentages. Violates GGG 1-to-1 input rule; triggers server-side botting heuristics.
                </li>
                <li className="p-2 rounded bg-red-950/20 border border-red-900/30">
                  <strong className="text-red-300 block">KEYSTROKE_INJECTION</strong>
                  Simulating keyboard/mouse hardware inputs directly into the Path of Exile 2 window without a direct human keypress trigger.
                </li>
                <li className="p-2 rounded bg-red-950/20 border border-red-900/30">
                  <strong className="text-red-300 block">MEMORY_HOOKING / DLL INJECTION</strong>
                  Scanning or modifying game memory via <code>OpenProcess</code>. Instantly detected by Easy Anti-Cheat (EAC) and results in permanent account bans.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 5: Local CLI Integration Guide */}
      {activeSubTab === 'cli_setup' && (
        <div className="space-y-4 text-xs text-zinc-300">
          <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 space-y-2">
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              Running Codex CLI with the Canonical PoE2 MCP Server
            </h4>
            <p className="text-zinc-400">
              Run Codex CLI or Claude Code locally on the computer where Path of Exile 2 is installed. The MCP server communicates via stdio, granting the AI read-only access to your character, gear, and combat events without touching memory or simulating inputs.
            </p>
          </div>

          {/* GitHub Repo Setup Block */}
          <div className="bg-black/90 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-amber-300 space-y-3 relative">
            <button
              onClick={() => copyToClipboard(`git clone https://github.com/rpeters1430/poe2-mcp.git\ncd poe2-mcp\nnpm install\nnpm run build\nnode dist/index.js`, 'git')}
              className="absolute top-3 right-3 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 transition font-sans"
            >
              {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'git' ? 'Copied' : 'Copy Commands'}</span>
            </button>

            <div className="text-zinc-500">// 1. Clone official repository:</div>
            <div>git clone https://github.com/rpeters1430/poe2-mcp.git</div>
            <div>cd poe2-mcp &amp;&amp; npm install &amp;&amp; npm run build</div>

            <div className="text-zinc-500 pt-2">// 2. Start MCP server:</div>
            <div>node dist/index.js</div>

            <div className="text-zinc-500 pt-2">// 3. Run Codex CLI with the server:</div>
            <div>codex --mcp-server &quot;node ./dist/index.js&quot; --prompt &quot;Compare my current weapon with inventory drops and check boss readiness&quot;</div>
          </div>

          {/* Configuration Snippets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 font-mono text-[11px]">~/.codex/config.toml</span>
                <button
                  onClick={() => copyToClipboard(`[mcp_servers.poe2]\ncommand = "node"\nargs = ["/path/to/poe2-mcp/dist/index.js"]\nenv = { POE2_LOG_PATH = "C:\\\\Program Files (x86)\\\\Grinding Gear Games\\\\Path of Exile 2\\\\logs\\\\Client.txt" }`, 'codex_toml')}
                  className="text-zinc-400 hover:text-zinc-200 text-[11px] flex items-center gap-1"
                >
                  {copiedKey === 'codex_toml' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="bg-black/80 p-3 rounded-lg text-amber-300 font-mono text-[11px] overflow-x-auto">
{`[mcp_servers.poe2]
command = "node"
args = ["/path/to/poe2-mcp/dist/index.js"]
env = { POE2_LOG_PATH = "C:\\\\Program Files (x86)\\\\Grinding Gear Games\\\\Path of Exile 2\\\\logs\\\\Client.txt" }`}
              </pre>
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 font-mono text-[11px]">claude_desktop_config.json</span>
                <button
                  onClick={() => copyToClipboard(`{\n  "mcpServers": {\n    "poe2": {\n      "command": "node",\n      "args": ["/path/to/poe2-mcp/dist/index.js"]\n    }\n  }\n}`, 'claude_json')}
                  className="text-zinc-400 hover:text-zinc-200 text-[11px] flex items-center gap-1"
                >
                  {copiedKey === 'claude_json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="bg-black/80 p-3 rounded-lg text-cyan-300 font-mono text-[11px] overflow-x-auto">
{`{
  "mcpServers": {
    "poe2": {
      "command": "node",
      "args": ["/path/to/poe2-mcp/dist/index.js"]
    }
  }
}`}
              </pre>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onDownloadScript}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Standalone poe2-mcp-server.mjs</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
