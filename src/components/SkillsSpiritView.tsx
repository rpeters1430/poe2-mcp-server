import { SkillGem } from '../types';
import { Sparkles, Gem, Link, ShieldCheck, Zap } from 'lucide-react';

interface SkillsSpiritViewProps {
  skillGems: SkillGem[];
  maxSpirit: number;
  reservedSpirit: number;
  availableSpirit: number;
}

export default function SkillsSpiritView({
  skillGems,
  maxSpirit,
  reservedSpirit,
  availableSpirit
}: SkillsSpiritViewProps) {
  const activeGems = skillGems.filter(g => g.type === 'Active');
  const metaGems = skillGems.filter(g => g.type === 'Meta');

  return (
    <div className="space-y-5">
      {/* PoE2 Spirit System Deep Dive */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900/60 to-zinc-900/60 border border-amber-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-800/80 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-zinc-100">Path of Exile 2 Spirit Resource & Meta-Gems</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Unlike PoE1, persistent buffs, heralds, summons, and triggered meta-gems reserve <strong>Spirit</strong> rather than Mana, allowing you to cast spells freely even with multiple persistent defensive auras active.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-950/80 px-4 py-2.5 rounded-lg border border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Total Spirit</span>
              <span className="text-zinc-200 font-bold text-sm">{maxSpirit}</span>
            </div>
            <div className="w-[1px] h-7 bg-zinc-800" />
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Reserved</span>
              <span className="text-amber-400 font-bold text-sm">{reservedSpirit}</span>
            </div>
            <div className="w-[1px] h-7 bg-zinc-800" />
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Free Capacity</span>
              <span className="text-emerald-400 font-bold text-sm">{availableSpirit}</span>
            </div>
          </div>
        </div>

        {/* Spirit Allocation Breakdown */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {metaGems.map((gem) => (
            <div key={gem.id} className="bg-zinc-950/60 border border-amber-900/30 rounded-lg p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> {gem.name}
                </span>
                <span className="text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded text-[11px] border border-amber-800/50">
                  {gem.spiritCost} Spirit
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 mt-1">{gem.dpsOrEffect}</p>
              {gem.supportGems && gem.supportGems.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <Link className="w-3 h-3 text-zinc-500" />
                  <span>Linked: {gem.supportGems.join(', ')}</span>
                </div>
              )}
            </div>
          ))}

          {/* Available Spirit Card */}
          <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-lg p-3 text-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-emerald-400 block mb-1">Available Spirit Pool</span>
              <p className="text-[11px] text-zinc-400">
                You have <strong>{availableSpirit} unreserved Spirit</strong>. You can activate another defensive banner or cast-on-shock meta-gem without impacting your mana recovery.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-emerald-300 font-medium">
              Equip a Scepter on Weapon Swap for +45 Spirit boost
            </div>
          </div>
        </div>
      </div>

      {/* Active Skills & Support Gem Socket Links */}
      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Gem className="w-4 h-4 text-cyan-400" /> Active Skill Gems & Support Links
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              In PoE2, support gems are socketed directly into skill gems (up to 5 supports per gem).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeGems.map((gem) => (
            <div key={gem.id} className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-4 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" /> {gem.name}
                  </h4>
                  <span className="text-[11px] text-zinc-500">
                    Level {gem.level} &bull; Quality +{gem.quality}% &bull; Mana Cost: {gem.manaCost}
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  {gem.tags[0]}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {gem.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {tag}
                  </span>
                ))}
              </div>

              {/* DPS / Effect */}
              <div className="text-[11px] text-zinc-200 bg-zinc-900/60 p-2 rounded border border-zinc-800/60">
                {gem.dpsOrEffect}
              </div>

              {/* Support Gems */}
              {gem.supportGems && gem.supportGems.length > 0 && (
                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                    Socketed Support Gems ({gem.supportGems.length}/5)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {gem.supportGems.map((sup, sIdx) => (
                      <span key={sIdx} className="text-[11px] font-medium px-2 py-1 rounded bg-amber-950/40 border border-amber-900/50 text-amber-200 flex items-center gap-1">
                        <Link className="w-3 h-3 text-amber-400" />
                        {sup}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
