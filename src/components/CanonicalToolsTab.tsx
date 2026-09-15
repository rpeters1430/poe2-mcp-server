import { useState } from 'react';
import { CharacterStats } from '../types';
import { MCP_TOOLS_DEFINITIONS } from '../data/poe2Database';
import { Play, Copy, Check, Terminal, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';

interface CanonicalToolsTabProps {
  character: CharacterStats;
}

export default function CanonicalToolsTab({ character }: CanonicalToolsTabProps) {
  const [selectedTool, setSelectedTool] = useState<string>('get_defenses');
  const [toolArgsJson, setToolArgsJson] = useState<string>('{}');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Preset argument templates for canonical tools
  const toolArgPresets: Record<string, any> = {
    list_characters: {},
    get_character_state: { characterName: character.name },
    get_inventory: { include_equipped: true },
    get_current_character: {},
    set_active_character: { characterName: character.name },
    get_defenses: {},
    get_offense_stats: {},
    get_passive_tree: {},
    compare_item: {
      slot: 'mainHand',
      itemText: 'Rarity: Rare\nThunderous Quarterstaff\nQuarterstaff\nPhysical Damage: 110-240\nCritical Strike Chance: 8.5%\nAttacks per Second: 1.35\n+45 to maximum Life\nAdds 34 to 68 Lightning Damage\n28% increased Attack Speed'
    },
    find_trade_upgrades: {
      slot: 'boots',
      priorities: 'maximum_life,fire_resistance,cold_resistance',
      maxPriceChaos: 50
    },
    get_recent_events: { limit: 10 },
    get_current_area: {},
    get_session_summary: {},
    get_active_build_status: {},
    import_pob_build: { source: 'https://pobb.in/poe2-monk-invoker-storm' },
    emit_advisory: {
      type: 'overlay_message',
      message: 'Boss telegraph detected: Thunder Strike imminent. Dodge roll immediately!',
      urgency: 'critical',
      reason: 'boss_mechanic_alert',
      ttlMs: 6000
    }
  };

  const handleSelectTool = (toolName: string) => {
    setSelectedTool(toolName);
    const preset = toolArgPresets[toolName] || {};
    setToolArgsJson(JSON.stringify(preset, null, 2));
    setResult(null);
  };

  const handleExecute = async () => {
    setLoading(true);
    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArgsJson);
      } catch {
        alert('Invalid JSON in arguments');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedTool,
          arguments: parsedArgs
        })
      });
      const data = await res.json();
      setResult(data.result?.structuredData || data.result?.content?.[0]?.text || data);
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const currentDef = MCP_TOOLS_DEFINITIONS.find(t => t.name === selectedTool);

  const copyResult = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Description Banner */}
      <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Canonical Tool Registry (`rpeters1430/poe2-mcp`)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              20 Tools Active
            </span>
          </h4>
          <p className="text-zinc-400 mt-1">
            Official tools defined by the canonical repository for read-only telemetry querying, item comparison, trade upgrade simulation, and advisory dispatching.
          </p>
        </div>
        <a
          href="https://github.com/rpeters1430/poe2-mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold self-start md:self-auto transition"
        >
          <span>View rpeters1430/poe2-mcp</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Tool Selection List */}
        <div className="lg:col-span-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex flex-col max-h-[560px] overflow-hidden">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800 mb-2 flex items-center justify-between">
            <span>Select Canonical Tool</span>
            <span className="text-amber-400 font-mono">{MCP_TOOLS_DEFINITIONS.length}</span>
          </div>
          <div className="overflow-y-auto space-y-1 flex-1 pr-1">
            {MCP_TOOLS_DEFINITIONS.map(tool => {
              const isSelected = tool.name === selectedTool;
              return (
                <button
                  key={tool.name}
                  onClick={() => handleSelectTool(tool.name)}
                  className={`w-full text-left p-2.5 rounded-lg border transition text-xs flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-amber-950/50 border-amber-600 text-amber-200'
                      : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                  }`}
                >
                  <div className="font-mono font-bold text-[11px] flex items-center justify-between">
                    <span>{tool.name}</span>
                    {tool.name === 'emit_advisory' && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        sidechannel
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-500 line-clamp-1">
                    {tool.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Argument Config & Live Execution Response */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tool Details Card */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800/80 gap-2">
              <div>
                <div className="font-mono text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>{selectedTool}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-sans font-normal">
                    Model Context Protocol
                  </span>
                </div>
                <p className="text-zinc-400 text-xs mt-1">
                  {currentDef?.description}
                </p>
              </div>
              <button
                onClick={handleExecute}
                disabled={loading}
                className="self-start sm:self-auto px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-2 transition shadow-md shadow-amber-950/40"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Executing...' : 'Invoke Tool'}</span>
              </button>
            </div>

            {/* Arguments Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-zinc-400">
                <span className="font-semibold uppercase tracking-wider">Arguments (JSON Schema)</span>
                <span className="text-[10px] text-zinc-500">Edit JSON or use preset</span>
              </div>
              <textarea
                value={toolArgsJson}
                onChange={e => setToolArgsJson(e.target.value)}
                rows={4}
                className="w-full bg-black text-amber-300 font-mono text-xs p-3 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Response Inspector */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col min-h-[280px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">Tool Result Output</span>
              </div>
              {result && (
                <button
                  onClick={copyResult}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Result'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto bg-black/90 p-3 rounded-lg border border-zinc-900 font-mono text-[11px] text-zinc-300">
              {loading ? (
                <div className="flex items-center justify-center h-full text-zinc-500 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Executing canonical tool {selectedTool}...</span>
                </div>
              ) : result ? (
                <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-center">
                  <Terminal className="w-8 h-8 text-zinc-700 mb-2" />
                  <span>Click &quot;Invoke Tool&quot; to test {selectedTool} against the live PoE2 game state.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
