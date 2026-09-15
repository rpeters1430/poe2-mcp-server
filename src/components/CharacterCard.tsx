import { CharacterStats } from '../types';
import { Heart, Droplet, Sparkles, Shield, Wind, Flame, Snowflake, Zap, Skull, Swords, Gauge } from 'lucide-react';

interface CharacterCardProps {
  character: CharacterStats;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const lifePercent = Math.min(100, Math.round((character.life / character.maxLife) * 100));
  const manaPercent = Math.min(100, Math.round((character.mana / character.maxMana) * 100));
  const esPercent = character.maxEnergyShield > 0
    ? Math.min(100, Math.round((character.energyShield / character.maxEnergyShield) * 100))
    : 0;

  // PoE2 Spirit gauge calculation
  const spiritReservedPercent = Math.min(100, Math.round((character.reservedSpirit / character.maxSpirit) * 100));
  const spiritAvailablePercent = Math.min(100 - spiritReservedPercent, Math.round((character.spirit / character.maxSpirit) * 100));

  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/60 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">{character.name}</h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/60 border border-amber-800/50 text-amber-300">
              Lv {character.level}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            <span className="text-amber-200 font-medium">{character.ascendancy}</span> {character.characterClass} &bull; {character.league}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">Current Location</span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 sm:justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {character.currentArea}
          </span>
        </div>
      </div>

      {/* Vitals Grid (Life, Mana, Energy Shield, and PoE2 Spirit) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-4">
        {/* Life Globe / Bar */}
        <div className="bg-zinc-950/70 border border-red-950/60 rounded-lg p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" /> Life
            </span>
            <span className="text-xs font-bold text-zinc-200">
              {character.life} <span className="text-zinc-500 font-normal">/ {character.maxLife}</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${lifePercent}%` }}
            />
          </div>
        </div>

        {/* Energy Shield Bar */}
        <div className="bg-zinc-950/70 border border-cyan-950/60 rounded-lg p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> Energy Shield
            </span>
            <span className="text-xs font-bold text-zinc-200">
              {character.energyShield} <span className="text-zinc-500 font-normal">/ {character.maxEnergyShield}</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${esPercent}%` }}
            />
          </div>
        </div>

        {/* Mana Bar */}
        <div className="bg-zinc-950/70 border border-blue-950/60 rounded-lg p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" /> Mana
            </span>
            <span className="text-xs font-bold text-zinc-200">
              {character.mana} <span className="text-zinc-500 font-normal">/ {character.maxMana}</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${manaPercent}%` }}
            />
          </div>
        </div>

        {/* PoE2 Spirit Reservation Bar */}
        <div className="bg-zinc-950/70 border border-amber-950/60 rounded-lg p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5" title="PoE2 Mechanic: Persistent buffs & auras reserve Spirit, not Mana">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Spirit (Auras)
            </span>
            <span className="text-xs font-bold text-zinc-200">
              <span className="text-emerald-400">{character.spirit} Free</span> <span className="text-zinc-500 font-normal">/ {character.maxSpirit}</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 flex overflow-hidden">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${spiritReservedPercent}%` }}
              title={`Reserved Spirit: ${character.reservedSpirit} (${spiritReservedPercent}%)`}
            />
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${spiritAvailablePercent}%` }}
              title={`Free Spirit: ${character.spirit} (${spiritAvailablePercent}%)`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>{character.reservedSpirit} Reserved</span>
            <span>{character.spirit} Unreserved</span>
          </div>
        </div>
      </div>

      {/* Stats Breakdown: Defenses, Resistances, Offense, Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3 border-t border-zinc-800/60 text-xs">
        {/* Defenses */}
        <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/40">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Mitigation</span>
          <div className="space-y-1.5 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-400" /> Armour:
              </span>
              <span className="font-semibold text-zinc-100">{character.armour.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-zinc-400" /> Evasion:
              </span>
              <span className="font-semibold text-zinc-100">{character.evasion.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Dodge Distance:</span>
              <span className="font-semibold text-emerald-400">+18%</span>
            </div>
          </div>
        </div>

        {/* Resistances (PoE2 Color Coding) */}
        <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/40">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Resistances</span>
          <div className="grid grid-cols-2 gap-2 text-zinc-200">
            <div className="flex items-center justify-between bg-red-950/30 px-2 py-1 rounded border border-red-900/40">
              <span className="text-red-400 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Fire
              </span>
              <span className={`font-bold ${character.fireResist >= 75 ? 'text-emerald-400' : 'text-red-300'}`}>
                {character.fireResist}%
              </span>
            </div>
            <div className="flex items-center justify-between bg-sky-950/30 px-2 py-1 rounded border border-sky-900/40">
              <span className="text-sky-400 flex items-center gap-1">
                <Snowflake className="w-3 h-3" /> Cold
              </span>
              <span className={`font-bold ${character.coldResist >= 75 ? 'text-emerald-400' : 'text-sky-300'}`}>
                {character.coldResist}%
              </span>
            </div>
            <div className="flex items-center justify-between bg-amber-950/30 px-2 py-1 rounded border border-amber-900/40">
              <span className="text-amber-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Light
              </span>
              <span className={`font-bold ${character.lightningResist >= 75 ? 'text-emerald-400' : 'text-amber-300'}`}>
                {character.lightningResist}%
              </span>
            </div>
            <div className="flex items-center justify-between bg-purple-950/30 px-2 py-1 rounded border border-purple-900/40">
              <span className="text-purple-400 flex items-center gap-1">
                <Skull className="w-3 h-3" /> Chaos
              </span>
              <span className={`font-bold ${character.chaosResist > 0 ? 'text-purple-300' : 'text-red-400'}`}>
                {character.chaosResist}%
              </span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1.5 text-center">
            Uncapped: F {character.uncappedFireResist}% &bull; C {character.uncappedColdResist}% &bull; L {character.uncappedLightningResist}%
          </div>
        </div>

        {/* Offense */}
        <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/40">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Main Skill Offense</span>
          <div className="space-y-1 text-zinc-300">
            <div className="font-semibold text-amber-300 truncate" title={character.mainSkillName}>
              {character.mainSkillName}
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-zinc-400 flex items-center gap-1">
                <Swords className="w-3.5 h-3.5 text-amber-400" /> Est. DPS:
              </span>
              <span className="font-bold text-amber-400 text-sm">{character.mainSkillDPS.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">Crit Rate:</span>
              <span>{character.critChance}% (x{character.critMultiplier}%)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">Attack/Cast Speed:</span>
              <span>{character.attackOrCastSpeed}/s</span>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/40">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Core Attributes</span>
          <div className="space-y-1.5 text-zinc-300">
            <div className="flex justify-between items-center bg-red-950/20 px-2 py-1 rounded">
              <span className="text-red-400 font-medium">Strength:</span>
              <span className="font-bold text-zinc-100">{character.strength}</span>
            </div>
            <div className="flex justify-between items-center bg-emerald-950/20 px-2 py-1 rounded">
              <span className="text-emerald-400 font-medium">Dexterity:</span>
              <span className="font-bold text-zinc-100">{character.dexterity}</span>
            </div>
            <div className="flex justify-between items-center bg-blue-950/20 px-2 py-1 rounded">
              <span className="text-blue-400 font-medium">Intelligence:</span>
              <span className="font-bold text-zinc-100">{character.intelligence}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
