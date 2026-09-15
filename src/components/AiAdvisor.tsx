import { useState, useRef, useEffect } from 'react';
import { AIQueryMessage, CharacterStats } from '../types';
import { Bot, Send, Sparkles, User, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';

interface AiAdvisorProps {
  character: CharacterStats;
  onSendQuery: (prompt: string) => Promise<{ response: string; modelUsed: string; toolsInvoked: string[] }>;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export default function AiAdvisor({
  character,
  onSendQuery,
  externalPrompt,
  onClearExternalPrompt
}: AiAdvisorProps) {
  const [messages, setMessages] = useState<AIQueryMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      content: `Greetings Exile. I am your Path of Exile 2 AI Companion, connected via MCP tools to **${character.name}** (Level ${character.level} ${character.ascendancy} ${character.characterClass}).

I have real-time visibility into your character vitals, Spirit reservations, equipped gear, and inventory grid. Ask me about defense caps, weapon upgrades, Spirit allocation, or boss strategies!`,
      toolsUsed: ['poe2_get_character', 'poe2_get_stats']
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-fill prompt if triggered externally (e.g. from item inspection "Ask AI")
  useEffect(() => {
    if (externalPrompt) {
      setInputPrompt(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt, onClearExternalPrompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || loading) return;

    const userMsg: AIQueryMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await onSendQuery(text);
      const assistantMsg: AIQueryMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: res.response,
        toolsUsed: res.toolsInvoked
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: AIQueryMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Error querying AI model: ${err.message || 'Server timeout'}`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    `Are my elemental and chaos resistances sufficient for Tier 10 Waystones?`,
    `Compare my equipped weapon against the rare Quarterstaff in my inventory.`,
    `I have free Spirit. How can I optimize my aura or meta-gem reservation?`,
    `What are the best support gems to pair with Falling Thunder?`
  ];

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-5 shadow-lg flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              PoE2 AI Advisor & Query Interface
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-medium">
                Gemini 3.8 Flash & MCP Live
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Live context injected: Character stats, equipped affixes & inventory items
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-800 flex-shrink-0 flex items-center justify-center mt-0.5">
                <Bot className="w-3.5 h-3.5 text-amber-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3.5 space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-zinc-950 font-medium ml-auto'
                  : 'bg-zinc-950/80 border border-zinc-800 text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-75 pb-1 border-b border-zinc-800/40">
                <span className="font-semibold">{msg.sender === 'user' ? 'You' : 'PoE2 MCP Assistant'}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Tools invoked badge */}
              {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 text-[10px] text-amber-300/90 pt-0.5">
                  <Cpu className="w-3 h-3 text-amber-400" />
                  <span>MCP Tools Invoked:</span>
                  {msg.toolsUsed.map((tool, i) => (
                    <span key={i} className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 font-mono text-[9px] text-zinc-300">
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              <div className="whitespace-pre-wrap leading-relaxed space-y-1.5 font-sans">
                {msg.content}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex-shrink-0 flex items-center justify-center mt-0.5">
                <User className="w-3.5 h-3.5 text-zinc-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-zinc-400 text-xs italic">
            <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Querying Gemini 3.8 Flash with live character snapshot...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="pt-2 border-t border-zinc-800/80 my-2">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quick Strategy Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={loading}
              className="text-[11px] px-2.5 py-1 rounded bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition text-left truncate max-w-full"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          id="ai-prompt-input"
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Ask about ${character.name}'s stats, upgrade evaluations, or PoE2 mechanics...`}
          disabled={loading}
          className="flex-1 bg-zinc-950 text-zinc-200 placeholder-zinc-500 text-xs px-3.5 py-2.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Query</span>
        </button>
      </form>
    </div>
  );
}
