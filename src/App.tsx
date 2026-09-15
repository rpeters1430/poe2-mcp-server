import { useState, useEffect } from 'react';
import Header from './components/Header';
import CharacterCard from './components/CharacterCard';
import PaperdollInventory from './components/PaperdollInventory';
import SkillsSpiritView from './components/SkillsSpiritView';
import LogWatcher from './components/LogWatcher';
import McpConsole from './components/McpConsole';
import AiAdvisor from './components/AiAdvisor';
import CodexWorkbench from './components/CodexWorkbench';
import HudOverlay from './components/HudOverlay';
import SafetyAdvisoryModal from './components/SafetyAdvisoryModal';
import { CharacterStats, PoE2Item, SkillGem, GameLogEntry, MCPToolDef, EquipSlot, CodexActionEnvelope } from './types';
import { advisoryToActionEnvelope } from './server/codexProtocol';
import { Shield, Sparkles, Terminal, Bot, Layers, Cpu } from 'lucide-react';

export default function App() {
  const [characters, setCharacters] = useState<CharacterStats[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<CharacterStats | null>(null);
  const [equipment, setEquipment] = useState<Record<EquipSlot, PoE2Item | null>>({} as any);
  const [inventory, setInventory] = useState<(PoE2Item | null)[]>([]);
  const [skillGems, setSkillGems] = useState<SkillGem[]>([]);
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [mcpTools, setMcpTools] = useState<MCPToolDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'character' | 'skills' | 'ai' | 'codex' | 'mcp' | 'logs'>('codex');
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [externalAiPrompt, setExternalAiPrompt] = useState<string | null>(null);
  const [hudActions, setHudActions] = useState<CodexActionEnvelope[]>([
    {
      actionId: 'act_init_01',
      type: 'HUD_OVERLAY_NOTIFICATION',
      priority: 'MEDIUM',
      durationMs: 6000,
      payload: {
        title: 'Codex CLI Protocol Ready',
        body: 'PoE2 MCP bridge connected. In-game 1:1 HUD overlay and Client.txt log watcher initialized.',
        style: 'success'
      },
      tosCompliant: true,
      tosAudit: {
        status: 'PASSED',
        category: 'HUD_OVERLAY',
        ruleReference: 'Compliant with GGG ToS §7 (External read-only overlay)'
      }
    },
    {
      actionId: 'act_init_02',
      type: 'CLIPBOARD_ACTION_MACRO',
      priority: 'MEDIUM',
      payload: {
        macroText: '/remaining',
        description: 'Single-action chat macro ready for manual paste'
      },
      tosCompliant: true,
      tosAudit: {
        status: 'PASSED',
        category: 'CLIPBOARD_1_TO_1',
        ruleReference: 'Compliant with GGG 1-Input = 1-Server-Action rule'
      }
    }
  ]);

  // Fetch initial game & MCP state from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [charsRes, invRes, skillsRes, logsRes, toolsRes] = await Promise.all([
        fetch('/api/poe2/characters').then(r => r.json()),
        fetch('/api/poe2/inventory').then(r => r.json()),
        fetch('/api/poe2/skills').then(r => r.json()),
        fetch('/api/poe2/logs').then(r => r.json()),
        fetch('/api/mcp/tools').then(r => r.json())
      ]);

      if (charsRes.characters) {
        setCharacters(charsRes.characters);
        const active = charsRes.characters.find((c: CharacterStats) => c.id === charsRes.activeCharacterId) || charsRes.characters[0];
        setActiveCharacter(active);
      }
      if (invRes.equipment) setEquipment(invRes.equipment);
      if (invRes.inventory) setInventory(invRes.inventory);
      if (skillsRes.skillGems) setSkillGems(skillsRes.skillGems);
      if (Array.isArray(logsRes)) setLogs(logsRes);
      if (toolsRes.tools) setMcpTools(toolsRes.tools);
    } catch (err) {
      console.error('Failed to load PoE2 / MCP state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Poll for latest advisory emitted to /api/advisory/latest from any client or AI model
  const [lastAdvisoryId, setLastAdvisoryId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/advisory/latest');
        const data = await res.json();
        if (data.latest && data.latest.id !== lastAdvisoryId) {
          setLastAdvisoryId(data.latest.id);
          const envelope = advisoryToActionEnvelope(data.latest);
          setHudActions(prev => [envelope, ...prev.filter(a => a.actionId !== envelope.actionId)].slice(0, 10));
        }
      } catch {
        // silent polling catch
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [lastAdvisoryId]);

  // Character Switcher
  const handleSelectCharacter = async (id: string) => {
    try {
      const res = await fetch('/api/poe2/select-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.character) {
        setActiveCharacter(data.character);
        // Refresh skills & inventory for current context
        fetchData();
      }
    } catch (err) {
      console.error('Failed to switch character:', err);
    }
  };

  // Equip item
  const handleEquipItem = async (inventoryIndex: number, slot: EquipSlot) => {
    try {
      const res = await fetch('/api/poe2/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventoryIndex, slot })
      });
      const data = await res.json();
      if (data.success) {
        setEquipment(data.equipment);
        setInventory(data.inventory);
      }
    } catch (err) {
      console.error('Failed to equip item:', err);
    }
  };

  // Ask AI about specific item
  const handleAskAiAboutItem = (item: PoE2Item) => {
    setExternalAiPrompt(
      `Please evaluate ${item.name} (${item.rarity} ${item.baseType}). Is it a direct DPS or defense upgrade for my ${activeCharacter?.ascendancy || ''} ${activeCharacter?.characterClass || ''}, and what are its best stat rolls?`
    );
    setActiveTab('ai');
  };

  // Simulate log event
  const handleAddSimulatedEvent = async (
    type: 'area' | 'boss' | 'item' | 'death' | 'level',
    message: string,
    detail?: string
  ) => {
    try {
      const res = await fetch('/api/poe2/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, detail })
      });
      const data = await res.json();
      if (data.entry) {
        setLogs(prev => [data.entry, ...prev]);
      }
    } catch (err) {
      console.error('Failed to append log event:', err);
    }
  };

  // Execute MCP Tool via JSON-RPC
  const handleExecuteMcpTool = async (toolName: string, args: Record<string, unknown>) => {
    const res = await fetch('/api/mcp/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: toolName,
        arguments: args
      })
    });
    return res.json();
  };

  // Send AI Query
  const handleSendAiQuery = async (prompt: string) => {
    const res = await fetch('/api/ai/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, includeContext: true })
    });
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    return res.json();
  };

  // Download standalone MCP server script
  const handleDownloadMcp = () => {
    window.location.href = '/api/mcp/code-bundle';
  };

  // Handler for dispatched actions from Codex CLI
  const handleDispatchActionToHud = (actions: CodexActionEnvelope[]) => {
    setHudActions(prev => [...actions, ...prev].slice(0, 10));
  };

  const handleDismissHudAction = (actionId: string) => {
    setHudActions(prev => prev.filter(a => a.actionId !== actionId));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-600 selection:text-zinc-950">
      {/* Top Navigation Header */}
      <Header
        characters={characters}
        activeCharacter={activeCharacter}
        onSelectCharacter={handleSelectCharacter}
        onRefresh={fetchData}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onDownloadMcp={handleDownloadMcp}
        loading={loading}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex-1 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
          <button
            id="tab-codex"
            onClick={() => setActiveTab('codex')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'codex'
                ? 'bg-amber-600 text-zinc-950 shadow-md shadow-amber-950/50'
                : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Codex CLI & Protocol</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              v1
            </span>
          </button>

          <button
            id="tab-character"
            onClick={() => setActiveTab('character')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'character'
                ? 'bg-amber-600 text-zinc-950 shadow-md shadow-amber-950/50'
                : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Character & Gear</span>
          </button>

          <button
            id="tab-skills"
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'skills'
                ? 'bg-amber-600 text-zinc-950 shadow-md shadow-amber-950/50'
                : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Skills & Spirit Auras</span>
          </button>

          <button
            id="tab-ai"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition relative ${
              activeTab === 'ai'
                ? 'bg-amber-600 text-zinc-950 shadow-md shadow-amber-950/50'
                : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Advisor (Codex / Gemini)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
          </button>

          <button
            id="tab-mcp"
            onClick={() => setActiveTab('mcp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'mcp'
                ? 'bg-amber-600 text-zinc-950 shadow-md shadow-amber-950/50'
                : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>MCP Server Studio</span>
          </button>

          <button
            id="tab-logs"
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'logs'
                ? 'bg-amber-600 text-zinc-950 shadow-md shadow-amber-950/50'
                : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Client.txt Stream ({logs.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeCharacter && (
          <div className="space-y-6">
            {activeTab === 'codex' && (
              <CodexWorkbench
                character={activeCharacter}
                onDispatchActionToHud={handleDispatchActionToHud}
                onDownloadScript={handleDownloadMcp}
              />
            )}

            {activeTab === 'character' && (
              <>
                <CharacterCard character={activeCharacter} />
                <PaperdollInventory
                  equipment={equipment}
                  inventory={inventory}
                  onEquipItem={handleEquipItem}
                  onAskAiAboutItem={handleAskAiAboutItem}
                />
              </>
            )}

            {activeTab === 'skills' && (
              <SkillsSpiritView
                skillGems={skillGems}
                maxSpirit={activeCharacter.maxSpirit}
                reservedSpirit={activeCharacter.reservedSpirit}
                availableSpirit={activeCharacter.spirit}
              />
            )}

            {activeTab === 'ai' && (
              <AiAdvisor
                character={activeCharacter}
                onSendQuery={handleSendAiQuery}
                externalPrompt={externalAiPrompt}
                onClearExternalPrompt={() => setExternalAiPrompt(null)}
              />
            )}

            {activeTab === 'mcp' && (
              <McpConsole
                tools={mcpTools}
                onExecuteTool={handleExecuteMcpTool}
                onDownloadCode={handleDownloadMcp}
              />
            )}

            {activeTab === 'logs' && (
              <LogWatcher
                logs={logs}
                onAddSimulatedEvent={handleAddSimulatedEvent}
              />
            )}
          </div>
        )}
      </main>

      {/* Live In-Game HUD Overlay (ToS Compliant 1:1 Action Renderer) */}
      <HudOverlay
        activeActions={hudActions}
        onDismissAction={handleDismissHudAction}
        characterName={activeCharacter?.name}
        currentArea={activeCharacter?.currentArea}
      />

      {/* Footer & Compliance Badge */}
      <footer className="border-t border-zinc-900 py-4 px-4 lg:px-8 text-xs text-zinc-500 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            Path of Exile 2 AI Companion &bull; Powered by Model Context Protocol (MCP) & Google Gemini 3.8 Flash
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Anti-Cheat Policy & Architecture
            </button>
            <span>&bull;</span>
            <span>Zero Process Injection</span>
          </div>
        </div>
      </footer>

      {/* Safety Advisory Modal */}
      <SafetyAdvisoryModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />
    </div>
  );
}
