import { useState, useEffect } from 'react';
import { CodexActionEnvelope } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  Volume2,
  VolumeX,
  Copy,
  Check,
  X,
  AlertTriangle,
  Flame,
  Search,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface HudOverlayProps {
  activeActions: CodexActionEnvelope[];
  onDismissAction?: (actionId: string) => void;
  characterName?: string;
  currentArea?: string;
}

export default function HudOverlay({
  activeActions,
  onDismissAction,
  characterName = 'Stormcaller_Ren',
  currentArea = 'Ogham Highlands'
}: HudOverlayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Synthesize sound effects using Web Audio API safely
  const playSynthesizedChime = (type: string) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'boss_phase' || type === 'warning_horn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio context might be restricted before first click
    }
  };

  // Play Web Speech API TTS if available
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis fallback
    }
  };

  // React to newly added audio cues
  useEffect(() => {
    const audioCue = activeActions.find(a => a.type === 'AUDIO_TACTICAL_CUE' && a.tosCompliant);
    if (audioCue?.payload?.spokenText) {
      playSynthesizedChime(audioCue.payload.soundFx || 'alert_chime');
      speakText(audioCue.payload.spokenText);
    }
  }, [activeActions]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter actions for display
  const hudNotifications = activeActions.filter(a => a.type === 'HUD_OVERLAY_NOTIFICATION');
  const blockedAlerts = activeActions.filter(a => a.type === 'DISALLOWED_AUTOMATION_ALERT');
  const clipboardMacros = activeActions.filter(a => a.type === 'CLIPBOARD_ACTION_MACRO');
  const regexFilters = activeActions.filter(a => a.type === 'STASH_REGEX_FILTER');

  if (activeActions.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
      <div className="bg-zinc-950/95 backdrop-blur-md border border-amber-500/40 rounded-xl shadow-2xl shadow-black/80 overflow-hidden">
        {/* HUD Window Header */}
        <div className="bg-zinc-900/90 px-3.5 py-2 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              PoE2 Live Tactical HUD Overlay
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              1:1 ToS Compliant
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute TTS Audio' : 'Unmute TTS Audio'}
              className="p-1 hover:text-zinc-200 transition"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-600" />}
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            >
              {isMinimized ? 'Expand' : 'Minimize'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-3.5 space-y-3 text-xs">
            {/* Blocked Automation Alert (Shows GGG TOS Gatekeeper in action) */}
            {blockedAlerts.map(alert => (
              <div
                key={alert.actionId}
                className="bg-red-950/80 border border-red-800 rounded-lg p-3 space-y-1.5 animate-pulse"
              >
                <div className="flex items-center justify-between text-red-300 font-bold">
                  <div className="flex items-center gap-1.5 text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>{alert.payload.title}</span>
                  </div>
                  {onDismissAction && (
                    <button onClick={() => onDismissAction(alert.actionId)} className="text-red-400 hover:text-red-200">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-red-200 leading-snug">
                  {alert.payload.body}
                </p>
                <div className="pt-1 border-t border-red-900/60 text-[10px] text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                  <span>Rule: {alert.tosAudit.ruleReference}</span>
                </div>
              </div>
            ))}

            {/* In-Game HUD Banners */}
            {hudNotifications.map(banner => {
              const isDanger = banner.payload.style === 'danger';
              const isWarning = banner.payload.style === 'warning';
              const isSuccess = banner.payload.style === 'success';

              const bgClass = isDanger
                ? 'bg-red-950/40 border-red-800/80 text-red-200'
                : isWarning
                ? 'bg-amber-950/50 border-amber-700/80 text-amber-200'
                : isSuccess
                ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-200'
                : 'bg-zinc-900/80 border-zinc-700 text-zinc-200';

              return (
                <div
                  key={banner.actionId}
                  className={`border rounded-lg p-3 space-y-1 ${bgClass}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      {isDanger && <Flame className="w-3.5 h-3.5 text-red-400" />}
                      {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                      {isSuccess && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      {banner.payload.title}
                    </span>
                    {onDismissAction && (
                      <button onClick={() => onDismissAction(banner.actionId)} className="opacity-70 hover:opacity-100">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-300">
                    {banner.payload.body}
                  </p>
                </div>
              );
            })}

            {/* 1:1 Clipboard Macro Hotbar */}
            {clipboardMacros.map(macro => (
              <div
                key={macro.actionId}
                className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Compliant 1:1 In-Game Macro:</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">Single Keystroke Paste</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/80 font-mono text-xs px-2.5 py-1.5 rounded border border-zinc-700 text-amber-300 font-bold">
                    {macro.payload.macroText}
                  </div>
                  <button
                    onClick={() => copyToClipboard(macro.payload.macroText || '', macro.actionId)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition"
                  >
                    {copiedId === macro.actionId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === macro.actionId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">{macro.payload.description}</p>
              </div>
            ))}

            {/* Stash Search Regex Filter */}
            {regexFilters.map(filter => (
              <div
                key={filter.actionId}
                className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Stash Search Highlight Regex:</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">{filter.payload.targetTab}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/80 font-mono text-[11px] px-2.5 py-1.5 rounded border border-zinc-700 text-cyan-300 truncate">
                    {filter.payload.filterRegex}
                  </div>
                  <button
                    onClick={() => copyToClipboard(filter.payload.filterRegex || '', filter.actionId)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs transition"
                  >
                    {copiedId === filter.actionId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === filter.actionId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">{filter.payload.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
