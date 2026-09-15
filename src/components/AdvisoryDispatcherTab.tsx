import { useState, useEffect } from 'react';
import { AdvisoryAction, CodexActionEnvelope } from '../types';
import { advisoryToActionEnvelope } from '../server/codexProtocol';
import {
  Bell,
  Volume2,
  FileText,
  Monitor,
  AlertTriangle,
  Play,
  Check,
  CheckCircle2,
  History,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface AdvisoryDispatcherTabProps {
  onDispatchActionToHud: (actions: CodexActionEnvelope[]) => void;
}

export default function AdvisoryDispatcherTab({ onDispatchActionToHud }: AdvisoryDispatcherTabProps) {
  const [type, setType] = useState<'overlay_message' | 'tts_callout' | 'desktop_notification' | 'log_note'>('overlay_message');
  const [urgency, setUrgency] = useState<'info' | 'warning' | 'critical'>('warning');
  const [message, setMessage] = useState('Boss charging Frost Slam! Dodge roll counter-clockwise now!');
  const [reason, setReason] = useState('boss_mechanic_alert');
  const [ttlMs, setTtlMs] = useState(6000);
  const [loading, setLoading] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/advisory/history');
      const data = await res.json();
      if (Array.isArray(data.history)) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('Failed to load advisory history:', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleEmit = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    setDispatchedSuccess(false);

    try {
      const payload: AdvisoryAction = {
        type,
        message,
        urgency,
        reason,
        ttlMs
      };

      const res = await fetch('/api/advisory/emit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.advisory) {
        // Convert to HUD Action Envelope and notify HUD overlay
        const envelope = advisoryToActionEnvelope(data.advisory);
        onDispatchActionToHud([envelope]);

        // If tts_callout, also trigger speech synthesis directly in browser
        if (type === 'tts_callout' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.rate = 1.05;
          utterance.pitch = urgency === 'critical' ? 1.2 : 1.0;
          window.speechSynthesis.speak(utterance);
        }

        setDispatchedSuccess(true);
        loadHistory();
        setTimeout(() => setDispatchedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to emit advisory:', err);
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    {
      type: 'overlay_message' as const,
      urgency: 'critical' as const,
      message: 'Lethal Slam Telegraphed! Dodge roll counter-clockwise now!',
      reason: 'boss_slam_avoidance'
    },
    {
      type: 'tts_callout' as const,
      urgency: 'warning' as const,
      message: 'Lightning Resistance is only 42%. Vulnerable in current map zone.',
      reason: 'defense_under_cap'
    },
    {
      type: 'desktop_notification' as const,
      urgency: 'info' as const,
      message: 'Divine Orb detected in Client.txt loot drop log!',
      reason: 'valuable_drop'
    },
    {
      type: 'overlay_message' as const,
      urgency: 'info' as const,
      message: 'Optimal upgrade candidate found on PoE2 Trade site for 15 chaos.',
      reason: 'trade_upgrade_alert'
    }
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Overview Banner */}
      <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 space-y-2">
        <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Advisory-Only Sidechannel Dispatcher (`emit_advisory`)</span>
        </h4>
        <p className="text-zinc-400 leading-relaxed">
          In strict compliance with Grinding Gear Games (GGG) Fair Play policies, AI models (such as Codex CLI) communicate strictly via external non-intrusive advisories. No game memory is written or hooked; actions are delivered via audio synthesis, external HUD overlays, desktop toasts, and tactical log notes.
        </p>
      </div>

      {/* Preset Quick Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
          Advisory Presets:
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setType(p.type);
              setUrgency(p.urgency);
              setMessage(p.message);
              setReason(p.reason);
            }}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition"
          >
            <span className={`text-[10px] font-bold ${
              p.urgency === 'critical' ? 'text-red-400' : p.urgency === 'warning' ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              {p.type}
            </span>
            <span>&bull;</span>
            <span className="truncate max-w-[170px]">{p.message}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Dispatch Form */}
        <div className="lg:col-span-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-4">
          <div className="font-bold text-sm text-zinc-200 pb-2 border-b border-zinc-800 flex items-center justify-between">
            <span>Compose Canonical Advisory</span>
            {dispatchedSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-normal">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dispatched to HUD & Audio!</span>
              </span>
            )}
          </div>

          {/* Channel Type */}
          <div>
            <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase tracking-wider">
              Communication Channel (type)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'overlay_message', label: 'Overlay HUD', icon: Monitor },
                { id: 'tts_callout', label: 'Audio TTS', icon: Volume2 },
                { id: 'desktop_notification', label: 'Notification', icon: Bell },
                { id: 'log_note', label: 'Log Note', icon: FileText }
              ].map(item => {
                const Icon = item.icon;
                const isSel = type === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setType(item.id as any)}
                    className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition ${
                      isSel
                        ? 'bg-amber-600/20 border-amber-600 text-amber-300 font-bold'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase tracking-wider">
              Urgency Level (urgency)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'info', label: 'INFO', border: 'border-cyan-800', active: 'bg-cyan-950/60 text-cyan-300 border-cyan-500' },
                { id: 'warning', label: 'WARNING', border: 'border-amber-800', active: 'bg-amber-950/60 text-amber-300 border-amber-500' },
                { id: 'critical', label: 'CRITICAL', border: 'border-red-800', active: 'bg-red-950/60 text-red-300 border-red-500' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setUrgency(item.id as any)}
                  className={`py-2 rounded-lg border text-xs font-bold transition text-center ${
                    urgency === item.id
                      ? item.active
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase tracking-wider">
              Advisory Message (message)
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              placeholder="Enter advisory text..."
              className="w-full bg-black text-zinc-100 font-sans text-xs p-3 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase tracking-wider">
                Reason Tag
              </label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-black text-zinc-200 font-mono text-xs px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase tracking-wider">
                Duration (TTL ms)
              </label>
              <input
                type="number"
                value={ttlMs}
                step={1000}
                onChange={e => setTtlMs(Number(e.target.value))}
                className="w-full bg-black text-zinc-200 font-mono text-xs px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            onClick={handleEmit}
            disabled={loading || !message.trim()}
            className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-amber-950/40"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Dispatching...' : 'Dispatch Canonical Advisory'}</span>
          </button>
        </div>

        {/* Right: History of Emitted Advisories */}
        <div className="lg:col-span-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col max-h-[500px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-xs text-zinc-300">
              <History className="w-4 h-4 text-amber-400" />
              <span>Advisory Stream & Delivery Log</span>
            </div>
            <span className="text-[10px] text-zinc-500">Live In-Game HUD Sync</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-center">
                <Bell className="w-8 h-8 text-zinc-700 mb-2" />
                <span>No advisories recorded in session yet.</span>
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        item.urgency === 'critical'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : item.urgency === 'warning'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}>
                        {item.urgency?.toUpperCase()}
                      </span>
                      <span className="text-zinc-300 font-mono">{item.type}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {item.dispatchedAt ? new Date(item.dispatchedAt).toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                  <div className="text-zinc-200 text-xs font-sans">
                    {item.message}
                  </div>
                  {item.reason && (
                    <div className="text-[10px] text-zinc-500 font-mono">
                      reason: {item.reason}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
