import { useState } from 'react';
import { MCPToolDef } from '../types';
import { Terminal, Play, Copy, Check, Code, Cpu, ExternalLink, Download } from 'lucide-react';

interface McpConsoleProps {
  tools: MCPToolDef[];
  onExecuteTool: (toolName: string, args: Record<string, unknown>) => Promise<any>;
  onDownloadCode: () => void;
}

export default function McpConsole({ tools, onExecuteTool, onDownloadCode }: McpConsoleProps) {
  const [selectedTool, setSelectedTool] = useState<MCPToolDef>(tools[0] || null);
  const [paramsJson, setParamsJson] = useState<string>(
    tools[0] ? JSON.stringify(tools[0].sampleParams, null, 2) : '{}'
  );
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tester' | 'claude_config' | 'codex_cli' | 'architecture'>('tester');

  const handleSelectTool = (tool: MCPToolDef) => {
    setSelectedTool(tool);
    setParamsJson(JSON.stringify(tool.sampleParams, null, 2));
    setExecutionResult(null);
  };

  const handleRunTool = async () => {
    if (!selectedTool) return;
    setLoading(true);
    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(paramsJson);
      } catch {
        parsedArgs = {};
      }
      const res = await onExecuteTool(selectedTool.name, parsedArgs);
      setExecutionResult(res);
    } catch (err: any) {
      setExecutionResult({ error: err.message || 'Tool execution failed' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const claudeDesktopConfig = `{
  "mcpServers": {
    "poe2-companion": {
      "command": "node",
      "args": [
        "C:\\\\Users\\\\YourUser\\\\poe2-mcp-server\\\\poe2-mcp-server.mjs"
      ],
      "env": {
        "POE2_LOG_PATH": "C:\\\\Program Files (x86)\\\\Grinding Gear Games\\\\Path of Exile 2\\\\logs\\\\Client.txt"
      }
    }
  }
}`;

  const codexCliConfig = `# Codex CLI / Local LLM MCP Setup
# 1. Download the standalone MCP server:
curl -O https://your-app-url/api/mcp/code-bundle -o poe2-mcp-server.mjs

# 2. Run with Codex CLI or any stdio MCP-compatible agent:
codex --mcp-server "node ./poe2-mcp-server.mjs" --prompt "What are my PoE2 Monk's weakest resistances and how should I fix them?"

# 3. In any MCP client, tools are auto-discovered:
# - poe2_get_character()
# - poe2_get_stats({ category: "defenses" })
# - poe2_evaluate_upgrade({ inventory_item_id: "inv_item_01", slot: "mainHand" })
# - poe2_read_client_log({ limit: 5 })`;

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-5 shadow-lg space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-zinc-100">Model Context Protocol (MCP) Server Workbench</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Standard JSON-RPC 2.0 MCP interface allowing LLMs (Codex CLI, Claude Desktop, Cursor, Gemini) to call live PoE2 tools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('tester')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'tester'
                ? 'bg-amber-600 text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Live Tool Tester
          </button>
          <button
            onClick={() => setActiveTab('claude_config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'claude_config'
                ? 'bg-amber-600 text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Claude Desktop Config
          </button>
          <button
            onClick={() => setActiveTab('codex_cli')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'codex_cli'
                ? 'bg-amber-600 text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Codex CLI Setup
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'architecture'
                ? 'bg-amber-600 text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Architecture
          </button>
        </div>
      </div>

      {/* Tab 1: Live Tool Tester */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Tool Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Registered MCP Tools ({tools.length})
            </span>
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {tools.map((tool) => {
                const isSelected = selectedTool?.name === tool.name;
                return (
                  <button
                    key={tool.name}
                    onClick={() => handleSelectTool(tool)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-600/80 text-amber-200'
                        : 'bg-zinc-950/50 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-mono font-bold text-amber-400 text-xs">{tool.name}</div>
                    <div className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                      {tool.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Runner & JSON-RPC Response (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {selectedTool && (
              <div className="bg-zinc-950/80 p-4 rounded-lg border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-amber-400 text-sm">{selectedTool.name}</span>
                    <p className="text-xs text-zinc-400 mt-0.5">{selectedTool.description}</p>
                  </div>
                  <button
                    onClick={handleRunTool}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs transition"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? 'Executing...' : 'Invoke Tool'}</span>
                  </button>
                </div>

                {/* Parameters Input */}
                <div>
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                    Arguments (JSON format)
                  </span>
                  <textarea
                    value={paramsJson}
                    onChange={(e) => setParamsJson(e.target.value)}
                    rows={4}
                    className="w-full bg-black/80 font-mono text-xs text-zinc-200 p-2.5 rounded border border-zinc-800 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>
            )}

            {/* Execution Result Box */}
            <div className="bg-black/90 p-4 rounded-lg border border-zinc-800 flex-1 flex flex-col min-h-[220px]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-900">
                <span className="text-[11px] font-mono font-semibold text-zinc-400">
                  JSON-RPC 2.0 Response Output
                </span>
                {executionResult && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(executionResult, null, 2), 'mcp-res')}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                  >
                    {copiedKey === 'mcp-res' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'mcp-res' ? 'Copied' : 'Copy Response'}</span>
                  </button>
                )}
              </div>

              <div className="font-mono text-xs text-emerald-400 overflow-x-auto flex-1">
                {executionResult ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(executionResult, null, 2)}</pre>
                ) : (
                  <div className="text-zinc-600 italic py-8 text-center">
                    Select a tool above and click "Invoke Tool" to view live JSON-RPC execution results.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Claude Desktop Config */}
      {activeTab === 'claude_config' && (
        <div className="space-y-4">
          <div className="bg-zinc-950/80 p-4 rounded-lg border border-zinc-800">
            <h4 className="text-sm font-bold text-zinc-100 mb-1">
              Setting Up with Claude Desktop (`claude_desktop_config.json`)
            </h4>
            <p className="text-xs text-zinc-400">
              Paste this configuration into your Claude Desktop settings file (located at <code>%APPDATA%\Claude\claude_desktop_config.json</code> on Windows or <code>~/Library/Application Support/Claude/claude_desktop_config.json</code> on macOS).
            </p>
          </div>

          <div className="bg-black/90 rounded-lg p-4 border border-zinc-800 relative">
            <button
              onClick={() => copyToClipboard(claudeDesktopConfig, 'claude')}
              className="absolute top-3 right-3 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 transition"
            >
              {copiedKey === 'claude' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'claude' ? 'Copied!' : 'Copy Config'}</span>
            </button>
            <pre className="font-mono text-xs text-amber-300 whitespace-pre-wrap">{claudeDesktopConfig}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Codex CLI Setup */}
      {activeTab === 'codex_cli' && (
        <div className="space-y-4">
          <div className="bg-zinc-950/80 p-4 rounded-lg border border-zinc-800">
            <h4 className="text-sm font-bold text-zinc-100 mb-1">
              Connecting with Codex CLI & Local Terminal LLMs
            </h4>
            <p className="text-xs text-zinc-400">
              Run this standalone script on the machine where Path of Exile 2 is installed. Codex CLI will automatically negotiate tool schemas via stdio.
            </p>
          </div>

          <div className="bg-black/90 rounded-lg p-4 border border-zinc-800 relative">
            <button
              onClick={() => copyToClipboard(codexCliConfig, 'codex')}
              className="absolute top-3 right-3 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 transition"
            >
              {copiedKey === 'codex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'codex' ? 'Copied!' : 'Copy Shell Script'}</span>
            </button>
            <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">{codexCliConfig}</pre>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onDownloadCode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Standalone poe2-mcp-server.mjs</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Architecture */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-zinc-950/80 p-4 rounded-lg border border-zinc-800 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> 1. Client.txt Streamer
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              PoE2 flushes instance, area, and combat events to disk in real-time. Tailing this file has <strong>zero detection vector</strong> because it operates strictly outside the game process address space.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-4 rounded-lg border border-zinc-800 space-y-2">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> 2. Model Context Protocol
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              Standardized JSON-RPC protocol over Stdio or SSE. Allows any modern AI model (Codex, Claude, Gemini) to inspect gear, evaluate stat deltas, and plan builds dynamically.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-4 rounded-lg border border-zinc-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Code className="w-4 h-4" /> 3. Official OAuth / PoB Export
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              For complete character tree and stash tabs, the MCP server connects to GGG's official profile REST API or reads exported JSON without risk of account penalties.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
