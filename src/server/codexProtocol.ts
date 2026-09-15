import {
  CharacterStats,
  PoE2Item,
  SkillGem,
  GameLogEntry,
  EquipSlot,
  CodexTelemetryPacket,
  CodexActionEnvelope,
  CodexDispatchResult,
  AdvisoryAction
} from '../types.ts';

/**
 * Translates a canonical rpeters1430/poe2-mcp AdvisoryAction into a CodexActionEnvelope
 * for the live in-app HUD overlay, TTS speech player, and desktop notification.
 */
export function advisoryToActionEnvelope(advisory: AdvisoryAction): CodexActionEnvelope {
  const urgencyToPriority: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> = {
    info: 'LOW',
    warning: 'HIGH',
    critical: 'CRITICAL'
  };

  const priority = urgencyToPriority[advisory.urgency] || 'MEDIUM';
  const durationMs = advisory.ttlMs || (advisory.urgency === 'critical' ? 10000 : 5000);

  if (advisory.type === 'overlay_message') {
    return {
      actionId: `adv_overlay_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: 'HUD_OVERLAY_NOTIFICATION',
      priority,
      durationMs,
      payload: {
        title: advisory.reason ? `Advisory: ${advisory.reason.replace(/_/g, ' ').toUpperCase()}` : 'PoE2 Advisory Alert',
        body: advisory.message,
        style: advisory.urgency === 'critical' ? 'danger' : advisory.urgency === 'warning' ? 'warning' : 'info'
      },
      tosCompliant: true,
      tosAudit: {
        status: 'PASSED',
        category: 'HUD_OVERLAY',
        ruleReference: 'Compliant: Non-intrusive advisory overlay message per rpeters1430/poe2-mcp PROTOCOL.md'
      }
    };
  }

  if (advisory.type === 'tts_callout') {
    return {
      actionId: `adv_tts_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: 'AUDIO_TACTICAL_CUE',
      priority,
      payload: {
        spokenText: advisory.message,
        soundFx: advisory.urgency === 'critical' ? 'warning_horn' : 'alert_chime'
      },
      tosCompliant: true,
      tosAudit: {
        status: 'PASSED',
        category: 'AUDIO_CUE',
        ruleReference: 'Compliant: External Text-to-Speech audio callout'
      }
    };
  }

  if (advisory.type === 'desktop_notification') {
    return {
      actionId: `adv_notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: 'HUD_OVERLAY_NOTIFICATION',
      priority,
      durationMs,
      payload: {
        title: 'Desktop Notification: PoE2 Advisor',
        body: advisory.message,
        style: advisory.urgency === 'critical' ? 'danger' : 'info'
      },
      tosCompliant: true,
      tosAudit: {
        status: 'PASSED',
        category: 'HUD_OVERLAY',
        ruleReference: 'Compliant: OS notification dispatch'
      }
    };
  }

  // Fallback: log_note / tactical advice
  return {
    actionId: `adv_note_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: 'TACTICAL_ADVICE',
    priority: 'LOW',
    payload: {
      title: 'Tactical Log Note',
      body: advisory.message
    },
    tosCompliant: true,
    tosAudit: {
      status: 'PASSED',
      category: 'HUD_OVERLAY',
      ruleReference: 'Compliant: Advisory log entry'
    }
  };
}

export function buildTelemetryPacket(
  character: CharacterStats,
  equipment: Record<EquipSlot, PoE2Item | null>,
  inventory: (PoE2Item | null)[],
  skillGems: SkillGem[],
  logEntries: GameLogEntry[],
  trigger?: {
    type: 'PERIODIC_SYNC' | 'LOG_EVENT_TRIGGERED' | 'USER_INPUT' | 'HOTKEY_INSPECT';
    event: string;
    description: string;
  }
): CodexTelemetryPacket {
  const inventorySummary = inventory
    .filter((item): item is PoE2Item => item !== null)
    .map(item => ({
      id: item.id,
      name: item.name,
      itemClass: item.itemClass,
      rarity: item.rarity,
      dps: item.stats?.dps
    }));

  const reservations = skillGems
    .filter(g => g.spiritCost && g.spiritCost > 0)
    .map(g => ({ skill: g.name, cost: g.spiritCost || 0 }));

  const sessId = `sess_${Date.now()}`;
  const isCombatActive = logEntries.slice(0, 3).some(
    e => e.type === 'boss' || e.type === 'death' || e.message.toLowerCase().includes('damage') || e.message.toLowerCase().includes('boss')
  );

  return {
    protocol: 'poe2-mcp-codex/v1',
    sessionId: sessId,
    packetId: `pkt_${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    trigger: trigger || {
      type: 'USER_INPUT',
      event: 'CLI_QUERY',
      description: 'Player issued query from Codex CLI or MCP workbench'
    },
    gameState: {
      character,
      equipment,
      inventorySummary,
      spiritBreakdown: {
        max: character.maxSpirit,
        reserved: character.reservedSpirit,
        free: character.spirit,
        reservations
      },
      combat: {
        inCombat: isCombatActive,
        threatLevel: isCombatActive ? 'HIGH' : 'NONE',
        recentDamageTaken: isCombatActive ? 420 : 0
      },
      recentEvents: logEntries.slice(0, 5)
    },
    complianceHeader: {
      tosRule: 'GGG Terms of Service Section 7 (Fair Play & Automation Prohibition)',
      allowedActionClasses: [
        'HUD_OVERLAY_NOTIFICATION (Non-intrusive visual toasts/banners)',
        'AUDIO_TACTICAL_CUE (TTS audio alerts & boss phase chimes)',
        'CLIPBOARD_ACTION_MACRO (Prepares 1-to-1 chat commands for manual user paste)',
        'STASH_REGEX_FILTER (Generates search expressions for in-game stash tabs)',
        'TACTICAL_ADVICE (Strategic guidance & DPS/defense calculations)'
      ],
      forbiddenActionClasses: [
        'KEYSTROKE_INJECTION (Automated keystrokes without 1:1 human trigger)',
        'AUTO_FLASK_DRINKING (Automated reactive flask activation)',
        'MEMORY_WRITE (Modifying client RAM or game state)',
        'AUTO_DODGE_MACROS (Multi-action movement or skill sequences)'
      ]
    }
  };
}

/**
 * GGG TOS Safety Interceptor
 * Audits every action generated by the AI model. If an action attempts illegal automation
 * or memory writes, it is intercepted and converted to a safe warning.
 */
export function auditActionEnvelope(rawAction: any): CodexActionEnvelope {
  const type = String(rawAction.type || 'TACTICAL_ADVICE').toUpperCase();

  // Check for disallowed automation patterns
  const isDisallowed =
    type.includes('AUTO_') ||
    type.includes('KEY_') ||
    type.includes('CLICK') ||
    type.includes('MEMORY') ||
    rawAction.payload?.blockedAction ||
    type === 'DISALLOWED_AUTOMATION_ALERT';

  if (isDisallowed) {
    return {
      actionId: rawAction.actionId || `act_tos_${Date.now()}`,
      type: 'DISALLOWED_AUTOMATION_ALERT',
      priority: 'CRITICAL',
      durationMs: 8000,
      payload: {
        title: 'Automation Blocked by GGG ToS Gatekeeper',
        body: rawAction.payload?.reason ||
          'Automated execution (e.g. auto-potting or simulated keystrokes) violates Grinding Gear Games ToS §7 and leads to account bans. Action intercepted and blocked.',
        blockedAction: rawAction.payload?.blockedAction || type,
        reason: 'Violation of GGG 1-Input-to-1-Server-Action rule. Replaced with compliant tactical HUD alert.',
        style: 'danger'
      },
      tosCompliant: false,
      tosAudit: {
        status: 'INTERCEPTED_AND_BLOCKED',
        category: 'BANNED_AUTOMATION',
        ruleReference: 'GGG ToS §7: No automated keystroke injection or macros triggering game actions'
      }
    };
  }

  // Handle Allowed Action: HUD Overlay Notification
  if (type === 'HUD_OVERLAY_NOTIFICATION') {
    return {
      actionId: rawAction.actionId || `act_hud_${Date.now()}`,
      type: 'HUD_OVERLAY_NOTIFICATION',
      priority: rawAction.priority || 'MEDIUM',
      durationMs: rawAction.durationMs || 5000,
      payload: {
        title: rawAction.payload?.title || 'Tactical Alert',
        body: rawAction.payload?.body || 'Boss phase update',
        style: rawAction.payload?.style || 'info'
      },
      tosCompliant: true,
      tosAudit: {
        status: 'PASSED',
        category: 'HUD_OVERLAY',
        ruleReference: 'Compliant: Read-only overlay rendering outside game process (Awakened PoE style)'
      }
    };
  }

  // Handle Allowed Action: Audio Cue
  if (type === 'AUDIO_TACTICAL_CUE') {
    return {
      actionId: rawAction.actionId || `act_audio_${Date.now()}`,
      type: 'AUDIO_TACTICAL_CUE',
      priority: rawAction.priority || 'HIGH',
      payload: {
        spokenText: rawAction.payload?.spokenText || 'Warning',
        soundFx: rawAction.payload?.soundFx || 'alert_chime'
      },
      tosCompliant: true,
      tosAudit: {
        status: 'PASSED',
        category: 'AUDIO_CUE',
        ruleReference: 'Compliant: External Text-to-Speech audio callout'
      }
    };
  }

  // Handle Allowed Action: 1:1 Clipboard Macro
  if (type === 'CLIPBOARD_ACTION_MACRO') {
    const macroText = String(rawAction.payload?.macroText || '/remaining');
    return {
      actionId: rawAction.actionId || `act_clip_${Date.now()}`,
      type: 'CLIPBOARD_ACTION_MACRO',
      priority: 'MEDIUM',
      payload: {
        macroText,
        description: rawAction.payload?.description || 'Prepares 1:1 chat command in clipboard for manual paste'
      },
      tosCompliant: true,
      tosAudit: {
        status: 'PASSED',
        category: 'CLIPBOARD_1_TO_1',
        ruleReference: 'Compliant: Single chat command copied to OS clipboard for manual player paste'
      }
    };
  }

  // Handle Allowed Action: Stash Regex Filter
  if (type === 'STASH_REGEX_FILTER') {
    return {
      actionId: rawAction.actionId || `act_regex_${Date.now()}`,
      type: 'STASH_REGEX_FILTER',
      priority: 'LOW',
      payload: {
        filterRegex: rawAction.payload?.filterRegex || 'tier: [1-2]|lightning',
        targetTab: rawAction.payload?.targetTab || 'Weapons & Gear',
        description: rawAction.payload?.description || 'Search expression for PoE2 stash tab highlighting'
      },
      tosCompliant: true,
      tosAudit: {
        status: 'PASSED',
        category: 'SEARCH_REGEX',
        ruleReference: 'Compliant: Copies client search regex into clipboard for stash filter box'
      }
    };
  }

  // Default: Tactical Advice
  return {
    actionId: rawAction.actionId || `act_adv_${Date.now()}`,
    type: 'TACTICAL_ADVICE',
    priority: 'LOW',
    payload: {
      title: rawAction.payload?.title || 'Tactical Strategy',
      body: rawAction.payload?.body || 'Review character statistics'
    },
    tosCompliant: true,
    tosAudit: {
      status: 'PASSED',
      category: 'HUD_OVERLAY',
      ruleReference: 'Compliant: Read-only strategic recommendation'
    }
  };
}

/**
 * Generates system instructions for the LLM enforcing the PoE2-MCP <-> Codex CLI Protocol
 */
export function getCodexProtocolPrompt(telemetry: CodexTelemetryPacket): string {
  return `You are the Path of Exile 2 Codex CLI Copilot connected via the Model Context Protocol (MCP).
You receive real-time game telemetry from the local PoE2 MCP server and respond with structured, actionable JSON.

CRITICAL ANTI-CHEAT & GGG TERMS OF SERVICE POLICY:
- Grinding Gear Games (GGG) strictly enforces: "One Server Action Per Player Input".
- ALLOWED ACTIONS:
  * "HUD_OVERLAY_NOTIFICATION": In-game visual overlay alert / banner / toast for the player.
  * "AUDIO_TACTICAL_CUE": Text-to-speech spoken audio warning or sound chime.
  * "CLIPBOARD_ACTION_MACRO": Prepares a 1:1 chat command (e.g., "/remaining", "/hideout", trade whispers) in the player's clipboard for them to manually paste.
  * "STASH_REGEX_FILTER": Generates regex search strings for stash tab item highlighting.
  * "TACTICAL_ADVICE": Strategic character or upgrade recommendations.
- STRICTLY FORBIDDEN:
  * Automating keystrokes (e.g. auto-drinking health/mana flasks, auto-dodging, combat botting).
  * Direct process memory manipulation.
- If the user asks for automated botting/flask triggers, you MUST include a "DISALLOWED_AUTOMATION_ALERT" action envelope explaining why GGG bans this and provide an approved HUD warning or audio alert instead!

CURRENT GAME TELEMETRY PACKET:
${JSON.stringify(telemetry, null, 2)}

RESPONSE REQUIREMENT:
You MUST respond with a JSON object matching this exact structure:
{
  "thought_process": "Brief analysis of character state, defense caps, spirit allocation, and recent events.",
  "player_message": "Clear, markdown-formatted tactical advice for the player.",
  "action_envelopes": [
    {
      "actionId": "act_01",
      "type": "HUD_OVERLAY_NOTIFICATION" | "AUDIO_TACTICAL_CUE" | "CLIPBOARD_ACTION_MACRO" | "STASH_REGEX_FILTER" | "TACTICAL_ADVICE" | "DISALLOWED_AUTOMATION_ALERT",
      "priority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "durationMs": 5000,
      "payload": { ... }
    }
  ]
}`;
}
