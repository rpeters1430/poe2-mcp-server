import { CharacterStats, PoE2Item, SkillGem, GameLogEntry, MCPToolDef, EquipSlot } from '../types';

export const INITIAL_CHARACTERS: CharacterStats[] = [
  {
    id: 'char_monk_01',
    name: 'Stormcaller_Ren',
    characterClass: 'Monk',
    ascendancy: 'Invoker',
    level: 79,
    currentArea: 'Ogham Highlands (Level 79 Map)',
    league: 'Standard PoE2 Early Access',
    life: 2840,
    maxLife: 3250,
    mana: 620,
    maxMana: 840,
    energyShield: 1420,
    maxEnergyShield: 1420,
    spirit: 45,
    maxSpirit: 150,
    reservedSpirit: 105,
    armour: 3850,
    evasion: 11400,
    fireResist: 75,
    coldResist: 75,
    lightningResist: 77,
    chaosResist: 28,
    uncappedFireResist: 92,
    uncappedColdResist: 84,
    uncappedLightningResist: 118,
    uncappedChaosResist: 28,
    strength: 142,
    dexterity: 268,
    intelligence: 195,
    mainSkillDPS: 48920,
    mainSkillName: 'Falling Thunder',
    attackOrCastSpeed: 3.42,
    critChance: 38.5,
    critMultiplier: 340,
  },
  {
    id: 'char_ranger_02',
    name: 'SilverArrow_Vane',
    characterClass: 'Ranger',
    ascendancy: 'Deadeye',
    level: 83,
    currentArea: 'Ruins of Vastiri (Tier 9)',
    league: 'Standard PoE2 Early Access',
    life: 3680,
    maxLife: 3680,
    mana: 410,
    maxMana: 520,
    energyShield: 350,
    maxEnergyShield: 350,
    spirit: 30,
    maxSpirit: 130,
    reservedSpirit: 100,
    armour: 1200,
    evasion: 18900,
    fireResist: 75,
    coldResist: 75,
    lightningResist: 75,
    chaosResist: 12,
    uncappedFireResist: 88,
    uncappedColdResist: 96,
    uncappedLightningResist: 76,
    uncappedChaosResist: 12,
    strength: 110,
    dexterity: 380,
    intelligence: 115,
    mainSkillDPS: 62450,
    mainSkillName: 'Piercing Crossbow Burst',
    attackOrCastSpeed: 2.85,
    critChance: 46.2,
    critMultiplier: 385,
  },
  {
    id: 'char_sorc_03',
    name: 'Ignis_Morrigan',
    characterClass: 'Sorceress',
    ascendancy: 'Infernalist',
    level: 74,
    currentArea: 'Sunken Temple of Utzaal',
    league: 'Standard PoE2 Early Access',
    life: 2450,
    maxLife: 2600,
    mana: 1840,
    maxMana: 1840,
    energyShield: 2280,
    maxEnergyShield: 2280,
    spirit: 20,
    maxSpirit: 180,
    reservedSpirit: 160,
    armour: 850,
    evasion: 2100,
    fireResist: 76,
    coldResist: 75,
    lightningResist: 75,
    chaosResist: -10,
    uncappedFireResist: 124,
    uncappedColdResist: 79,
    uncappedLightningResist: 81,
    uncappedChaosResist: -10,
    strength: 95,
    dexterity: 130,
    intelligence: 345,
    mainSkillDPS: 53100,
    mainSkillName: 'Volcanic Meteor',
    attackOrCastSpeed: 1.75,
    critChance: 31.0,
    critMultiplier: 290,
  },
  {
    id: 'char_warrior_04',
    name: 'Krag_Ironbreaker',
    characterClass: 'Warrior',
    ascendancy: 'Titan',
    level: 81,
    currentArea: 'Crematorium Catacombs',
    league: 'Standard PoE2 Early Access',
    life: 4950,
    maxLife: 5100,
    mana: 340,
    maxMana: 420,
    energyShield: 0,
    maxEnergyShield: 0,
    spirit: 40,
    maxSpirit: 120,
    reservedSpirit: 80,
    armour: 26400,
    evasion: 800,
    fireResist: 78,
    coldResist: 76,
    lightningResist: 76,
    chaosResist: 45,
    uncappedFireResist: 104,
    uncappedColdResist: 92,
    uncappedLightningResist: 88,
    uncappedChaosResist: 45,
    strength: 410,
    dexterity: 95,
    intelligence: 85,
    mainSkillDPS: 41200,
    mainSkillName: 'Earthshatter Slam',
    attackOrCastSpeed: 1.35,
    critChance: 14.5,
    critMultiplier: 210,
  }
];

export const INITIAL_EQUIPMENT: Record<EquipSlot, PoE2Item | null> = {
  mainHand: {
    id: 'eq_weapon_01',
    name: "Thunder's Reach",
    baseType: 'Gothic Quarterstaff',
    itemClass: 'Quarterstaff',
    rarity: 'Rare',
    itemLevel: 80,
    requiredLevel: 68,
    quality: 20,
    sockets: 4,
    runeSockets: 2,
    runesSlotted: ['Rune of the Gale (+18% Lightning Damage)', 'Iron Rune (+12% Stun Buildup)'],
    implicitMods: ['+25% to Global Critical Strike Multiplier', 'Grants Level 10 Bell Strike'],
    explicitMods: [
      '+124% Increased Physical Damage',
      'Adds 34 to 68 Lightning Damage to Attacks',
      '+28% to Attack Speed',
      '+38 to Dexterity',
      'Hits have 15% chance to Shock enemies as if dealing 250% more Damage'
    ],
    iconType: 'quarterstaff',
    stats: {
      dps: 462,
      physicalDamage: '184 - 340',
      criticalStrikeChance: '8.4%',
      attacksPerSecond: 1.58
    }
  },
  offHand: null, // 2-Handed weapon equipped
  weaponSwap1: {
    id: 'eq_swap_01',
    name: 'Gale Wind Scepter',
    baseType: 'Bone Scepter',
    itemClass: 'Scepter',
    rarity: 'Rare',
    itemLevel: 75,
    requiredLevel: 64,
    quality: 15,
    sockets: 3,
    runeSockets: 1,
    runesSlotted: ['Rune of Flow'],
    implicitMods: ['+32% Increased Elemental Damage'],
    explicitMods: ['+1 to Level of all Lightning Spell Gems', '+45 to Spirit', '+18% Cast Speed'],
    iconType: 'scepter'
  },
  weaponSwap2: null,
  helmet: {
    id: 'eq_helm_01',
    name: 'Crown of the Gale Invoker',
    baseType: 'Silk Hood',
    itemClass: 'Helmet',
    rarity: 'Rare',
    itemLevel: 78,
    requiredLevel: 65,
    quality: 20,
    sockets: 4,
    runeSockets: 1,
    runesSlotted: ['Rune of Mind (+15 Max Mana)'],
    implicitMods: ['+10% Increased Evasion Rating'],
    explicitMods: [
      '+88 to Maximum Life',
      '+140 to Evasion Rating',
      '+95 to Energy Shield',
      '+36% to Lightning Resistance',
      '+24% to Chaos Resistance'
    ],
    iconType: 'helmet',
    stats: {
      evasion: 340,
      energyShield: 180
    }
  },
  bodyArmour: {
    id: 'eq_chest_01',
    name: "Tempest's Garb",
    baseType: 'Ascetic Vestment',
    itemClass: 'Body Armour',
    rarity: 'Rare',
    itemLevel: 81,
    requiredLevel: 70,
    quality: 20,
    sockets: 5,
    runeSockets: 2,
    runesSlotted: ['Rune of Resilience (+40 Max Life)', 'Rune of Warding (+10% Fire Res)'],
    implicitMods: ['+15% Increased Spirit Regeneration Rate'],
    explicitMods: [
      '+118 to Maximum Life',
      '+540 to Evasion Rating',
      '+310 to Energy Shield',
      '+42% to Fire Resistance',
      '+38% to Cold Resistance',
      '12% of Physical Damage taken as Lightning Damage'
    ],
    iconType: 'chest',
    stats: {
      evasion: 980,
      energyShield: 410
    }
  },
  gloves: {
    id: 'eq_gloves_01',
    name: 'Thunderclap Wraps',
    baseType: 'Linen Grips',
    itemClass: 'Gloves',
    rarity: 'Rare',
    itemLevel: 77,
    requiredLevel: 62,
    quality: 20,
    sockets: 4,
    runeSockets: 1,
    runesSlotted: ['Rune of Velocity (+8% Attack Speed)'],
    implicitMods: ['Attacks have 10% chance to Maim on Hit'],
    explicitMods: [
      '+74 to Maximum Life',
      '+16% to Attack Speed',
      '+32% to Lightning Resistance',
      '+34% to Cold Resistance',
      'Adds 12 to 25 Cold Damage to Attacks'
    ],
    iconType: 'gloves'
  },
  boots: {
    id: 'eq_boots_01',
    name: 'Windrunner Treads',
    baseType: 'Padded Greaves',
    itemClass: 'Boots',
    rarity: 'Rare',
    itemLevel: 79,
    requiredLevel: 66,
    quality: 20,
    sockets: 4,
    runeSockets: 1,
    runesSlotted: ['Rune of the Wind (+5% Movement Speed)'],
    implicitMods: ['Cannot be Stunned while Rolling or Dodging'],
    explicitMods: [
      '+30% Increased Movement Speed',
      '+82 to Maximum Life',
      '+39% to Fire Resistance',
      '+31% to Cold Resistance',
      '+18% Increased Dodge Distance'
    ],
    iconType: 'boots'
  },
  amulet: {
    id: 'eq_amulet_01',
    name: 'Eye of the Storm Invoker',
    baseType: 'Turquoise Talisman',
    itemClass: 'Amulet',
    rarity: 'Unique',
    itemLevel: 82,
    requiredLevel: 68,
    implicitMods: ['+24 to Dexterity and Intelligence'],
    explicitMods: [
      '+1 to Level of all Lightning Skill Gems',
      '+35 to Maximum Spirit',
      '+35% to Global Critical Strike Multiplier',
      'Herald of Thunder reserves 20% less Spirit',
      'Gain 15% of Physical Damage as Extra Lightning Damage'
    ],
    flavorText: 'The sky does not bend to the will of mortals; it bends to those who become the current.',
    iconType: 'amulet'
  },
  ring1: {
    id: 'eq_ring_01',
    name: 'Topaz Loop of Zeal',
    baseType: 'Topaz Ring',
    itemClass: 'Ring',
    rarity: 'Rare',
    itemLevel: 76,
    requiredLevel: 60,
    implicitMods: ['+28% to Lightning Resistance'],
    explicitMods: [
      '+68 to Maximum Life',
      '+24 to All Attributes',
      '+32% to Fire Resistance',
      'Adds 8 to 18 Physical Damage to Attacks',
      '+12% to Cast/Attack Speed'
    ],
    iconType: 'ring'
  },
  ring2: {
    id: 'eq_ring_02',
    name: 'Amethyst Band of the Void',
    baseType: 'Amethyst Ring',
    itemClass: 'Ring',
    rarity: 'Rare',
    itemLevel: 79,
    requiredLevel: 64,
    implicitMods: ['+21% to Chaos Resistance'],
    explicitMods: [
      '+72 to Maximum Life',
      '+34% to Cold Resistance',
      '+29% to Fire Resistance',
      '+14 to Spirit',
      'Non-Damaging Ailments have 18% increased Effect'
    ],
    iconType: 'ring'
  },
  belt: {
    id: 'eq_belt_01',
    name: 'Thunderweave Girdle',
    baseType: 'Heavy Sash',
    itemClass: 'Belt',
    rarity: 'Rare',
    itemLevel: 80,
    requiredLevel: 68,
    implicitMods: ['+35 to Maximum Life'],
    explicitMods: [
      '+94 to Maximum Life',
      '+44% to Lightning Resistance',
      '+38% to Cold Resistance',
      '+24% Increased Flask Recovery Rate',
      'Flasks gain 1 charge every 3 seconds'
    ],
    iconType: 'belt'
  },
  charm1: {
    id: 'eq_charm_01',
    name: 'Silver Antidote Charm',
    baseType: 'Jade Charm',
    itemClass: 'Charm',
    rarity: 'Magic',
    itemLevel: 70,
    requiredLevel: 55,
    implicitMods: ['Removes Poison on use'],
    explicitMods: ['Grants +25% Chaos Resistance for 6 seconds'],
    iconType: 'charm'
  },
  charm2: {
    id: 'eq_charm_02',
    name: 'Ignition Dampening Charm',
    baseType: 'Ruby Charm',
    itemClass: 'Charm',
    rarity: 'Magic',
    itemLevel: 72,
    requiredLevel: 58,
    implicitMods: ['Cannot be Ignited for 5 seconds on trigger'],
    explicitMods: ['+15% Maximum Fire Resistance during effect'],
    iconType: 'charm'
  },
  charm3: null
};

export const INITIAL_INVENTORY: (PoE2Item | null)[] = [
  {
    id: 'inv_item_01',
    name: "Storm's Resonance",
    baseType: 'Oak Quarterstaff',
    itemClass: 'Quarterstaff',
    rarity: 'Rare',
    itemLevel: 82,
    requiredLevel: 72,
    quality: 20,
    sockets: 4,
    runeSockets: 2,
    runesSlotted: [],
    implicitMods: ['+30% to Global Critical Strike Multiplier'],
    explicitMods: [
      '+148% Increased Physical Damage',
      'Adds 42 to 88 Lightning Damage',
      '+32% Attack Speed',
      '+24% to Critical Strike Chance',
      'Gain 20% of Physical Damage as Extra Cold Damage'
    ],
    iconType: 'quarterstaff',
    stats: {
      dps: 540,
      physicalDamage: '215 - 390',
      criticalStrikeChance: '9.2%',
      attacksPerSecond: 1.64
    }
  },
  {
    id: 'inv_item_02',
    name: 'Divine Orb',
    baseType: 'Currency',
    itemClass: 'Currency',
    rarity: 'Normal',
    itemLevel: 85,
    requiredLevel: 1,
    implicitMods: [],
    explicitMods: ['Randomizes the values of all explicit modifiers on an item.'],
    flavorText: 'A touch of divinity that alters fate without breaking destiny.',
    iconType: 'currency_divine'
  },
  {
    id: 'inv_item_03',
    name: 'Chaos Orb (x4)',
    baseType: 'Currency',
    itemClass: 'Currency',
    rarity: 'Normal',
    itemLevel: 80,
    requiredLevel: 1,
    implicitMods: [],
    explicitMods: ['Reforges a rare item with new random modifiers.'],
    iconType: 'currency_chaos'
  },
  {
    id: 'inv_item_04',
    name: 'Greater Rune of Storms',
    baseType: 'Socketable Rune',
    itemClass: 'Rune',
    rarity: 'Magic',
    itemLevel: 78,
    requiredLevel: 60,
    implicitMods: [],
    explicitMods: ['In Weapons: Adds 18 to 36 Lightning Damage', 'In Armour: +15% Lightning Resistance & 5% Max Shock'],
    iconType: 'rune'
  },
  {
    id: 'inv_item_05',
    name: 'Uncut Skill Gem (Tier 18)',
    baseType: 'Uncut Gem',
    itemClass: 'Skill Gem',
    rarity: 'Normal',
    itemLevel: 79,
    requiredLevel: 68,
    implicitMods: [],
    explicitMods: ['Can be engraved with any Level 18 Active Skill at the Gemcutting Altar.'],
    iconType: 'gem'
  },
  {
    id: 'inv_item_06',
    name: 'Uncut Support Gem (Tier 3)',
    baseType: 'Uncut Support',
    itemClass: 'Support Gem',
    rarity: 'Magic',
    itemLevel: 80,
    requiredLevel: 65,
    implicitMods: [],
    explicitMods: ['Engrave into advanced Support Gems such as Overcharge, Fist of War, or Spell Echo.'],
    iconType: 'support_gem'
  },
  {
    id: 'inv_item_07',
    name: 'Galeforce Ring',
    baseType: 'Two-Stone Ring',
    itemClass: 'Ring',
    rarity: 'Rare',
    itemLevel: 81,
    requiredLevel: 65,
    implicitMods: ['+16% to Fire and Lightning Resistance'],
    explicitMods: [
      '+79 to Maximum Life',
      '+38% to Chaos Resistance',
      '+18 to All Attributes',
      '+12 to Spirit'
    ],
    iconType: 'ring'
  },
  {
    id: 'inv_item_08',
    name: 'Waystone of the Molten Core (Tier 11)',
    baseType: 'Waystone',
    itemClass: 'Endgame Map',
    rarity: 'Rare',
    itemLevel: 81,
    requiredLevel: 75,
    implicitMods: ['Monster Level: 80', 'Item Rarity: +45%'],
    explicitMods: [
      'Monsters deal 32% extra Physical as Fire Damage',
      'Monsters have 40% increased Area of Effect',
      'Players have -12% to Maximum Elemental Resistances'
    ],
    iconType: 'waystone'
  },
  // Remaining empty inventory slots (representing a 5x8 grid)
  ...Array(32).fill(null)
];

export const INITIAL_SKILL_GEMS: SkillGem[] = [
  {
    id: 'gem_01',
    name: 'Falling Thunder',
    level: 19,
    quality: 20,
    type: 'Active',
    manaCost: 28,
    tags: ['Attack', 'Lightning', 'AoE', 'Quarterstaff', 'Combo Finisher'],
    dpsOrEffect: '48,920 Lightning DPS (3 hits combo with AoE shockwave)',
    supportGems: ['Overcharge Support', 'Lightning Penetration', 'Fist of War Support', 'Increased Critical Damage']
  },
  {
    id: 'gem_02',
    name: 'Tempest Flurry',
    level: 18,
    quality: 15,
    type: 'Active',
    manaCost: 14,
    tags: ['Attack', 'Physical', 'Lightning', 'Quarterstaff', 'Combo Starter'],
    dpsOrEffect: '24,300 DPS - Rapid strikes generating Tempest charges',
    supportGems: ['Faster Attacks Support', 'Power Charge On Critical']
  },
  {
    id: 'gem_03',
    name: 'Herald of Thunder',
    level: 18,
    quality: 20,
    type: 'Meta',
    spiritCost: 45, // PoE2 Spirit Reservation
    tags: ['Spell', 'Herald', 'Lightning', 'Spirit Reservation'],
    dpsOrEffect: 'Reserves 45 Spirit. Lightning bolts strike shocked foes for 8,200 damage.',
    supportGems: ['Innervate Support']
  },
  {
    id: 'gem_04',
    name: 'Defensive Wind Shroud',
    level: 17,
    quality: 10,
    type: 'Meta',
    spiritCost: 60, // PoE2 Spirit Reservation
    tags: ['Aura', 'Defensive', 'Buff', 'Spirit Reservation'],
    dpsOrEffect: 'Reserves 60 Spirit. +35% Evasion Rating and 15% increased movement speed.',
    supportGems: ['Enlighten Support']
  },
  {
    id: 'gem_05',
    name: 'Rolling Magma Strike',
    level: 16,
    quality: 0,
    type: 'Active',
    manaCost: 18,
    tags: ['Attack', 'Fire', 'Combo Pivot'],
    dpsOrEffect: '16,400 Fire DPS - Piercing bounce wave',
    supportGems: ['Elemental Focus']
  }
];

export const INITIAL_LOG_ENTRIES: GameLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '16:29:45',
    rawTimestamp: '2026/09/14 16:29:45 10849201 a3b [INFO Client 14204]',
    type: 'area',
    message: 'Entered Area: Ogham Highlands (Level 79 Endgame Waystone)',
    detail: 'Instance Server: us-central-02, Monster Level: 79'
  },
  {
    id: 'log_02',
    timestamp: '16:29:58',
    rawTimestamp: '2026/09/14 16:29:58 10849410 a3b [INFO Client 14204]',
    type: 'boss',
    message: 'Engaged Boss: Corrupted Ironwood Golem',
    detail: 'Boss Modifiers: Extra Fire Damage, Unstoppable, Resolute'
  },
  {
    id: 'log_03',
    timestamp: '16:30:12',
    rawTimestamp: '2026/09/14 16:30:12 10849890 a3b [INFO Client 14204]',
    type: 'item',
    message: 'Loot Dropped: Divine Orb & Tier 18 Uncut Skill Gem',
    detail: 'Item Rarity Filter: Tier 1 High-Value Alert'
  },
  {
    id: 'log_04',
    timestamp: '16:30:18',
    rawTimestamp: '2026/09/14 16:30:18 10850020 a3b [INFO Client 14204]',
    type: 'level',
    message: 'Area Cleared: 185/210 monsters slain. Current EXP: 68.4%',
    detail: 'Next passive skill point in 31.6% EXP'
  }
];

export const MCP_TOOLS_DEFINITIONS: MCPToolDef[] = [
  // --- Canonical rpeters1430/poe2-mcp Tools ---
  {
    name: 'list_characters',
    description: 'List character names on the authorized PoE account (via official GGG API, or falling back to poe.ninja public profile if GGG OAuth is not configured).',
    parameters: {
      type: 'object',
      properties: {}
    },
    sampleParams: {}
  },
  {
    name: 'get_character_state',
    description: 'Fetch a snapshot of a PoE2 character level, class, experience, and league via official GGG API or poe.ninja fallback.',
    parameters: {
      type: 'object',
      properties: {
        characterName: {
          type: 'string',
          description: 'Exact character name, case-sensitive'
        }
      },
      required: ['characterName']
    },
    sampleParams: { characterName: 'Stormcaller_Ren' }
  },
  {
    name: 'get_inventory',
    description: 'Fetch a character equipped items and skills (via GGG API, or falling back to poe.ninja / active PoB build).',
    parameters: {
      type: 'object',
      properties: {
        characterName: {
          type: 'string',
          description: 'Optional character name. Defaults to active character.'
        }
      }
    },
    sampleParams: { characterName: 'Stormcaller_Ren' }
  },
  {
    name: 'get_current_character',
    description: 'Return the currently selected or inferred active character name.',
    parameters: {
      type: 'object',
      properties: {}
    },
    sampleParams: {}
  },
  {
    name: 'set_active_character',
    description: 'Explicitly set the active character name used by subsequent queries.',
    parameters: {
      type: 'object',
      properties: {
        characterName: {
          type: 'string',
          description: 'Exact character name to set as active'
        }
      },
      required: ['characterName']
    },
    sampleParams: { characterName: 'SilverArrow_Vane' }
  },
  {
    name: 'get_defenses',
    description: 'Compute gear-only defense statistics (Armour, Evasion, Life, Mana, Energy Shield, Block, elemental/chaos resistances, attributes) with raw & capped figures.',
    parameters: {
      type: 'object',
      properties: {
        characterName: {
          type: 'string',
          description: 'Optional character name'
        }
      }
    },
    sampleParams: { characterName: 'Stormcaller_Ren' }
  },
  {
    name: 'get_offense_stats',
    description: 'Compute gear-derived offensive statistics (weapon physical & elemental damage ranges, APS, crit chance, crit multiplier, accuracy, attack/cast speeds).',
    parameters: {
      type: 'object',
      properties: {
        characterName: {
          type: 'string',
          description: 'Optional character name'
        }
      }
    },
    sampleParams: { characterName: 'Stormcaller_Ren' }
  },
  {
    name: 'get_passive_tree',
    description: 'Retrieve allocated passive tree node hashes and resolved notable/keystone/mastery names and stats.',
    parameters: {
      type: 'object',
      properties: {
        characterName: {
          type: 'string',
          description: 'Optional character name'
        }
      }
    },
    sampleParams: { characterName: 'Stormcaller_Ren' }
  },
  {
    name: 'compare_item',
    description: 'Compare candidate item text (copied from game or clipboard) against the currently equipped item in the same slot. Computes defense & stat deltas.',
    parameters: {
      type: 'object',
      properties: {
        itemText: {
          type: 'string',
          description: 'Raw multiline text of the candidate item from clipboard'
        },
        slot: {
          type: 'string',
          description: 'Optional target slot override (e.g. mainHand, ring1, bodyArmour)'
        },
        characterName: {
          type: 'string',
          description: 'Optional character name'
        }
      },
      required: ['itemText']
    },
    sampleParams: {
      slot: 'mainHand',
      itemText: `Item Class: Quarterstaffs\nRarity: Rare\nThunder's Reach\nGothic Quarterstaff\n--------\nPhysical Damage: 184-340\nCritical Strike Chance: 8.4%\nAttacks per Second: 1.58\n--------\nRequirements:\nLevel: 68\nDex: 142\n--------\nItem Level: 80\n--------\n+25% to Global Critical Strike Multiplier (implicit)\n--------\n+124% Increased Physical Damage\nAdds 34 to 68 Lightning Damage\n+28% to Attack Speed`
    }
  },
  {
    name: 'find_trade_upgrades',
    description: 'Advisory and read-only: Search online listings on the official GGG trade site for direct gear upgrades matching specified priorities (maximum_life, resistances) without automating trade.',
    parameters: {
      type: 'object',
      properties: {
        slot: {
          type: 'string',
          description: 'Slot to search upgrades for (e.g. boots, helmet, ring, amulet)'
        },
        priorities: {
          type: 'string',
          description: 'Comma-separated priorities (e.g. "maximum_life,fire_resistance,cold_resistance")'
        },
        league: {
          type: 'string',
          description: 'League name (e.g. Standard PoE2 Early Access)'
        },
        maxPriceChaos: {
          type: 'number',
          description: 'Maximum price in Chaos Orbs (default: 50)'
        }
      },
      required: ['slot']
    },
    sampleParams: { slot: 'boots', priorities: 'maximum_life,fire_resistance,cold_resistance', maxPriceChaos: 25 }
  },
  {
    name: 'get_recent_events',
    description: 'Query near-real-time events parsed from the local Client.txt log (area transitions, level ups, deaths, trade whispers).',
    parameters: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of events to return'
        },
        types: {
          type: 'string',
          description: 'Comma-separated event types to filter (area_entered, level_up, death, trade_whisper)'
        }
      }
    },
    sampleParams: { limit: 5 }
  },
  {
    name: 'get_current_area',
    description: 'Return the last area the character entered per the local Client.txt game log.',
    parameters: {
      type: 'object',
      properties: {}
    },
    sampleParams: {}
  },
  {
    name: 'get_session_summary',
    description: 'Return a summary of the current play session parsed from Client.txt (areas visited, deaths, level-ups, session duration).',
    parameters: {
      type: 'object',
      properties: {}
    },
    sampleParams: {}
  },
  {
    name: 'get_active_build_status',
    description: 'Report current active build provenance (imported PoB file, poe.ninja profile, pinned state, TTL freshness, and summary stats).',
    parameters: {
      type: 'object',
      properties: {}
    },
    sampleParams: {}
  },
  {
    name: 'import_pob_build',
    description: 'Import and parse a Path of Building 2 build from share code, pobb.in URL, XML, or file.',
    parameters: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          description: 'PoB share code, pobb.in URL, or raw XML string'
        }
      },
      required: ['source']
    },
    sampleParams: { source: 'https://pobb.in/sample-poe2-build' }
  },
  {
    name: 'emit_advisory',
    description: 'Canonical AI action channel: Dispatch a non-intrusive advisory message to the player via overlay message, TTS voice callout, desktop notification, or log note. Strictly ToS-compliant (never touches the game process).',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Channel: "overlay_message" | "tts_callout" | "desktop_notification" | "log_note"',
          enum: ['overlay_message', 'tts_callout', 'desktop_notification', 'log_note']
        },
        message: {
          type: 'string',
          description: 'Player-facing advisory message'
        },
        urgency: {
          type: 'string',
          description: 'Urgency level: "info" | "warning" | "critical"',
          enum: ['info', 'warning', 'critical']
        },
        reason: {
          type: 'string',
          description: 'Optional machine-readable reason (e.g. low_flask_charges, boss_phase_2, resist_uncapped)'
        },
        ttlMs: {
          type: 'number',
          description: 'Optional time-to-live in milliseconds for overlay auto-dismiss'
        }
      },
      required: ['type', 'message', 'urgency']
    },
    sampleParams: {
      type: 'overlay_message',
      message: 'Fire resistance uncapped (68%). You will take +28% damage from the upcoming Flame Weaver slam!',
      urgency: 'warning',
      reason: 'resist_uncapped',
      ttlMs: 5000
    }
  },
  // Legacy aliases for backward compatibility
  {
    name: 'poe2_get_spirit_breakdown',
    description: 'Analyzes Path of Exile 2 Spirit capacity, total reserved spirit across persistent buffs and meta-gems, and remaining unreserved spirit.',
    parameters: {
      type: 'object',
      properties: {}
    },
    sampleParams: {}
  }
];
