export type CharacterClass = 'Monk' | 'Ranger' | 'Sorceress' | 'Warrior' | 'Mercenary' | 'Witch';

export type ItemRarity = 'Normal' | 'Magic' | 'Rare' | 'Unique';

export type EquipSlot =
  | 'helmet'
  | 'bodyArmour'
  | 'gloves'
  | 'boots'
  | 'mainHand'
  | 'offHand'
  | 'weaponSwap1'
  | 'weaponSwap2'
  | 'amulet'
  | 'ring1'
  | 'ring2'
  | 'belt'
  | 'charm1'
  | 'charm2'
  | 'charm3';

export interface ItemModifier {
  text: string;
  tier?: string;
  isImplicit?: boolean;
}

export interface PoE2Item {
  id: string;
  name: string;
  baseType: string;
  itemClass: string;
  rarity: ItemRarity;
  itemLevel: number;
  requiredLevel: number;
  quality?: number;
  sockets?: number;
  runeSockets?: number;
  runesSlotted?: string[];
  implicitMods: string[];
  explicitMods: string[];
  flavorText?: string;
  iconType: string;
  stats?: {
    dps?: number;
    physicalDamage?: string;
    criticalStrikeChance?: string;
    attacksPerSecond?: number;
    armour?: number;
    evasion?: number;
    energyShield?: number;
    spiritGranted?: number;
  };
}

export interface SkillGem {
  id: string;
  name: string;
  level: number;
  quality: number;
  type: 'Active' | 'Meta' | 'Support';
  spiritCost?: number;
  manaCost?: number;
  tags: string[];
  dpsOrEffect: string;
  supportGems?: string[];
}

export interface CharacterStats {
  id: string;
  name: string;
  characterClass: CharacterClass;
  ascendancy: string;
  level: number;
  currentArea: string;
  league: string;
  
  // Vitals
  life: number;
  maxLife: number;
  mana: number;
  maxMana: number;
  energyShield: number;
  maxEnergyShield: number;
  
  // PoE2 Core Mechanic: Spirit
  spirit: number;
  maxSpirit: number;
  reservedSpirit: number;

  // Defenses
  armour: number;
  evasion: number;
  fireResist: number;
  coldResist: number;
  lightningResist: number;
  chaosResist: number;
  uncappedFireResist: number;
  uncappedColdResist: number;
  uncappedLightningResist: number;
  uncappedChaosResist: number;

  // Attributes
  strength: number;
  dexterity: number;
  intelligence: number;

  // Offense
  mainSkillDPS: number;
  mainSkillName: string;
  attackOrCastSpeed: number;
  critChance: number;
  critMultiplier: number;
}

export interface GameLogEntry {
  id: string;
  timestamp: string;
  rawTimestamp: string;
  type: 'area' | 'level' | 'death' | 'item' | 'boss' | 'system' | 'trade';
  message: string;
  detail?: string;
}

export interface MCPToolDef {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required?: string[];
  };
  sampleParams: Record<string, unknown>;
}

export interface AIQueryMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  toolsUsed?: string[];
  mcpContext?: Record<string, unknown>;
  actionEnvelopes?: CodexActionEnvelope[];
}

export type CodexActionType =
  | 'HUD_OVERLAY_NOTIFICATION'
  | 'AUDIO_TACTICAL_CUE'
  | 'CLIPBOARD_ACTION_MACRO'
  | 'STASH_REGEX_FILTER'
  | 'TACTICAL_ADVICE'
  | 'DISALLOWED_AUTOMATION_ALERT';

// Canonical types aligned with https://github.com/rpeters1430/poe2-mcp

export type AdvisoryActionType =
  | 'overlay_message'
  | 'tts_callout'
  | 'desktop_notification'
  | 'log_note';

export type AdvisoryUrgency = 'info' | 'warning' | 'critical';

export interface AdvisoryAction {
  type: AdvisoryActionType;
  message: string;
  urgency: AdvisoryUrgency;
  reason?: string;
  ttlMs?: number;
}

export interface AdvisoryResult {
  delivered: boolean;
  dispatchedVia: AdvisoryActionType;
  dispatchedAt: string;
  error?: string;
}

export interface GggResistanceStat {
  raw: number;
  capped: number;
}

export interface DefenseStats {
  source: 'gear_only';
  computedAt: string;
  characterName: string;
  life: number;
  mana: number;
  energyShield: number;
  armour: number;
  evasion: number;
  blockChancePercent: number | null;
  resistances: {
    fire: GggResistanceStat;
    cold: GggResistanceStat;
    lightning: GggResistanceStat;
    chaos: GggResistanceStat;
  };
  attributes: { strength: number; dexterity: number; intelligence: number };
  note: string;
}

export interface WeaponOffense {
  slot: string | null;
  name: string;
  physicalDamage: { min: number; max: number } | null;
  elementalDamage: Array<{ min: number; max: number }>;
  criticalStrikeChance: number | null;
  attacksPerSecond: number | null;
}

export interface OffenseStats {
  source: 'gear_only';
  computedAt: string;
  characterName: string;
  weapons: WeaponOffense[];
  accuracyRating: number;
  increasedAttackSpeedPercent: number;
  increasedCastSpeedPercent: number;
  increasedCriticalStrikeChancePercent: number;
  criticalDamageBonusPercent: number;
  otherDamageMods: Array<{ raw: string; matches: Array<{ stat: string; value: number }> }>;
  note: string;
}

export interface ResolvedPassiveNode {
  id: number;
  name: string | null;
  isKeystone: boolean;
  isNotable: boolean;
  isMastery: boolean;
  ascendancyId: string | null;
  stats: string[];
}

export interface PassiveTreeSnapshot {
  source: 'ggg_api' | 'pob_import' | 'poe_ninja';
  fetchedAt: string;
  characterName: string;
  ascendancyClass: string | null;
  allocatedHashes: number[];
  resolvedNodes: ResolvedPassiveNode[];
  jewelData: Record<string, unknown>;
  note: string;
}

export interface StatDelta {
  stat: string;
  before: number | null;
  after: number | null;
  delta: number | null;
}

export interface ItemComparison {
  source: 'computed';
  comparedAt: string;
  characterName: string;
  slot: string | null;
  current: { name: string; mods: string[] } | null;
  candidate: { name: string; mods: string[] };
  statDeltas: StatDelta[];
  defensesBefore: DefenseStats | null;
  defensesAfter: DefenseStats | null;
  note: string;
}

export type TradePriority =
  | 'maximum_life'
  | 'fire_resistance'
  | 'cold_resistance'
  | 'lightning_resistance'
  | 'chaos_resistance';

export interface TradeCandidate {
  id: string | null;
  name: string;
  baseType: string;
  itemLevel: number | null;
  price: { amount: number | null; currency: string | null } | null;
  priorityDeltas: Partial<Record<TradePriority, number>>;
  improvesAllPriorities: boolean;
  mods: string[];
  score: number;
}

export interface TradeUpgradeResult {
  source: 'poe_trade_site';
  fetchedAt: string;
  apiStatus: 'undocumented_official_site_endpoint';
  league: string;
  searchUrl: string;
  totalMatches: number;
  currentItem: { name: string; slot: string | null; priorityValues: Partial<Record<TradePriority, number>> } | null;
  appliedFilters: {
    slot: string;
    category: string;
    priorities: TradePriority[];
    minimumCandidateValues: Partial<Record<TradePriority, number>>;
    maxPrice: { amount: number; currency: string };
    maxRequiredLevel: number | null;
    onlineOnly: boolean;
  };
  candidates: TradeCandidate[];
  warning: string | null;
  rateLimit: Record<string, string>;
  note: string;
}

export interface ActiveBuildStatus {
  available: boolean;
  origin: string | null;
  pinned: boolean | null;
  savedAt: string | null;
  refreshedAt: string | null;
  ageMs: number | null;
  stale: boolean | null;
  refreshable: boolean;
  sourceFile: string | null;
  sourceModifiedAt: string | null;
  sourceUpdatedAt: string | null;
  identity: {
    accountName: string | null;
    characterName: string | null;
    league: string | null;
    leagueUrl: string | null;
  } | null;
  buildSummary: {
    className: string | null;
    ascendClassName: string | null;
    level: number | null;
    equipmentCount: number;
  } | null;
}

export interface CodexActionEnvelope {
  actionId: string;
  type: CodexActionType;
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  durationMs?: number;
  payload: {
    title?: string;
    body?: string;
    style?: 'danger' | 'warning' | 'info' | 'success';
    spokenText?: string;
    soundFx?: 'alert_chime' | 'boss_phase' | 'loot_drop' | 'warning_horn';
    macroText?: string;
    description?: string;
    filterRegex?: string;
    targetTab?: string;
    blockedAction?: string;
    reason?: string;
  };
  tosCompliant: boolean;
  tosAudit: {
    status: 'PASSED' | 'INTERCEPTED_AND_BLOCKED';
    category: 'HUD_OVERLAY' | 'AUDIO_CUE' | 'CLIPBOARD_1_TO_1' | 'SEARCH_REGEX' | 'BANNED_AUTOMATION';
    ruleReference: string;
  };
}

export interface CodexTelemetryPacket {
  protocol: 'poe2-mcp-codex/v1';
  sessionId: string;
  packetId?: string;
  timestamp: string;
  trigger: {
    type: 'PERIODIC_SYNC' | 'LOG_EVENT_TRIGGERED' | 'USER_INPUT' | 'HOTKEY_INSPECT';
    event: string;
    description: string;
  };
  gameState: {
    character: CharacterStats;
    equipment: Record<EquipSlot, PoE2Item | null>;
    inventorySummary: { id: string; name: string; itemClass: string; rarity: string; dps?: number }[];
    spiritBreakdown: {
      max: number;
      reserved: number;
      free: number;
      reservations: { skill: string; cost: number }[];
    };
    recentEvents: GameLogEntry[];
    combat?: {
      inCombat: boolean;
      threatLevel?: string;
      recentDamageTaken?: number;
    };
  };
  complianceHeader: {
    tosRule: string;
    allowedActionClasses: string[];
    forbiddenActionClasses: string[];
  };
}

export interface CodexDispatchResult {
  sessionId: string;
  thoughtProcess: string;
  playerMessage: string;
  assistantNarrative?: string;
  modelUsed: string;
  toolsInvoked: string[];
  outboundTelemetry: CodexTelemetryPacket;
  actionEnvelopes: CodexActionEnvelope[];
  interceptedActions?: { rawType: string; reason: string; ruleViolation: string }[];
  tosSafetySummary: {
    compliantCount: number;
    blockedCount: number;
    overallStatus: 'COMPLIANT' | 'WARNING_ACTIONS_FILTERED';
  };
}
