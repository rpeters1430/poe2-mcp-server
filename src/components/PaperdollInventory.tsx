import { useState } from 'react';
import { PoE2Item, EquipSlot } from '../types';
import { Shield, Sparkles, Zap, ArrowRightLeft, Bot, Layers, Info } from 'lucide-react';

interface PaperdollInventoryProps {
  equipment: Record<EquipSlot, PoE2Item | null>;
  inventory: (PoE2Item | null)[];
  onEquipItem: (inventoryIndex: number, slot: EquipSlot) => void;
  onAskAiAboutItem: (item: PoE2Item) => void;
}

export default function PaperdollInventory({
  equipment,
  inventory,
  onEquipItem,
  onAskAiAboutItem
}: PaperdollInventoryProps) {
  const [selectedItem, setSelectedItem] = useState<{ item: PoE2Item; isEquipped: boolean; slot?: EquipSlot; invIndex?: number } | null>(
    equipment.mainHand ? { item: equipment.mainHand, isEquipped: true, slot: 'mainHand' } : null
  );

  const getRarityBorder = (rarity?: string) => {
    switch (rarity) {
      case 'Unique':
        return 'border-amber-600 bg-amber-950/20 text-amber-400';
      case 'Rare':
        return 'border-yellow-500/80 bg-yellow-950/20 text-yellow-300';
      case 'Magic':
        return 'border-sky-500/70 bg-sky-950/20 text-sky-300';
      default:
        return 'border-zinc-700 bg-zinc-900/60 text-zinc-300';
    }
  };

  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case 'Unique':
        return 'bg-amber-900/80 text-amber-200 border-amber-600/60';
      case 'Rare':
        return 'bg-yellow-900/70 text-yellow-200 border-yellow-600/50';
      case 'Magic':
        return 'bg-sky-900/70 text-sky-200 border-sky-600/50';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const renderSlot = (slot: EquipSlot, label: string) => {
    const item = equipment[slot];
    const isSelected = selectedItem?.isEquipped && selectedItem?.slot === slot;

    return (
      <button
        key={slot}
        onClick={() => item && setSelectedItem({ item, isEquipped: true, slot })}
        className={`w-full p-2.5 rounded-lg border text-left transition-all duration-200 relative group flex flex-col justify-between ${
          item ? getRarityBorder(item.rarity) : 'border-zinc-800 bg-zinc-950/40 text-zinc-600'
        } ${isSelected ? 'ring-2 ring-amber-400 shadow-md shadow-amber-900/40' : 'hover:border-zinc-600'}`}
      >
        <div className="flex items-center justify-between w-full mb-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
            {label}
          </span>
          {item?.quality && item.quality > 0 && (
            <span className="text-[10px] text-cyan-400 font-bold">+{item.quality}%</span>
          )}
        </div>

        {item ? (
          <div>
            <div className="text-xs font-bold truncate leading-snug">{item.name}</div>
            <div className="text-[11px] text-zinc-400 truncate">{item.baseType}</div>
            {item.runeSockets && item.runeSockets > 0 && (
              <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-400">
                <Sparkles className="w-3 h-3" />
                <span>{item.runesSlotted?.length || 0}/{item.runeSockets} Runes</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs italic text-zinc-600 py-1">Empty Slot</div>
        )}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Equipment Paperdoll (5 cols) */}
      <div className="lg:col-span-5 bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-4 shadow-lg backdrop-blur-sm flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" /> Equipped Gear (Paperdoll)
          </h3>
          <span className="text-[11px] text-zinc-500">PoE2 13-Slot Layout</span>
        </div>

        {/* Paperdoll Layout */}
        <div className="space-y-3 flex-1">
          {/* Row 1: Weapons & Swap */}
          <div className="grid grid-cols-2 gap-2.5">
            {renderSlot('mainHand', 'Main Hand (2H)')}
            {renderSlot('weaponSwap1', 'Weapon Swap I')}
          </div>

          {/* Row 2: Head & Body Armour */}
          <div className="grid grid-cols-2 gap-2.5">
            {renderSlot('helmet', 'Helmet')}
            {renderSlot('bodyArmour', 'Body Armour')}
          </div>

          {/* Row 3: Gloves & Boots */}
          <div className="grid grid-cols-2 gap-2.5">
            {renderSlot('gloves', 'Gloves')}
            {renderSlot('boots', 'Boots')}
          </div>

          {/* Row 4: Amulet & Belt */}
          <div className="grid grid-cols-2 gap-2.5">
            {renderSlot('amulet', 'Amulet')}
            {renderSlot('belt', 'Belt')}
          </div>

          {/* Row 5: Rings */}
          <div className="grid grid-cols-2 gap-2.5">
            {renderSlot('ring1', 'Left Ring')}
            {renderSlot('ring2', 'Right Ring')}
          </div>

          {/* Row 6: PoE2 Charms / Flask Belt */}
          <div className="pt-2 border-t border-zinc-800/80">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
              PoE2 Charms (Automated Reaction Triggers)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {renderSlot('charm1', 'Charm I')}
              {renderSlot('charm2', 'Charm II')}
            </div>
          </div>
        </div>
      </div>

      {/* Middle/Right Column: 5x8 Inventory Grid + Item Tooltip Inspector (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Inventory Grid Card */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-zinc-100">Bag Inventory</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                {inventory.filter(Boolean).length} / {inventory.length}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500">Click item to inspect & compare</span>
          </div>

          {/* 5x8 Grid */}
          <div className="grid grid-cols-8 gap-2 bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80 min-h-[220px]">
            {inventory.slice(0, 40).map((item, index) => {
              const isSelected = !selectedItem?.isEquipped && selectedItem?.invIndex === index;
              return (
                <button
                  key={`inv_${index}`}
                  onClick={() => item && setSelectedItem({ item, isEquipped: false, invIndex: index })}
                  className={`aspect-square rounded-md border text-center transition flex flex-col items-center justify-center p-1 relative ${
                    item
                      ? getRarityBorder(item.rarity)
                      : 'border-zinc-800/60 bg-zinc-900/30 hover:border-zinc-700'
                  } ${isSelected ? 'ring-2 ring-amber-400 z-10' : ''}`}
                >
                  {item ? (
                    <>
                      <span className="text-[10px] font-bold line-clamp-2 leading-tight">
                        {item.name.split(' ')[0]}
                      </span>
                      {item.itemClass === 'Currency' && (
                        <span className="text-[9px] text-amber-300 font-semibold mt-0.5">Orb</span>
                      )}
                      {item.itemClass === 'Rune' && (
                        <span className="text-[9px] text-purple-300 font-semibold mt-0.5">Rune</span>
                      )}
                    </>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Item Tooltip & Actions */}
        {selectedItem?.item ? (
          <div className="bg-zinc-950/90 border border-amber-950/80 rounded-xl p-4 shadow-xl text-xs space-y-3">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-100">{selectedItem.item.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRarityBadge(selectedItem.item.rarity)}`}>
                    {selectedItem.item.rarity}
                  </span>
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">
                  {selectedItem.item.baseType} &bull; Item Level {selectedItem.item.itemLevel} (Requires Lv {selectedItem.item.requiredLevel})
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {!selectedItem.isEquipped && selectedItem.invIndex !== undefined && (
                  <button
                    onClick={() => {
                      // Smart slot detection based on itemClass
                      let targetSlot: EquipSlot = 'mainHand';
                      if (selectedItem.item.itemClass.includes('Helmet')) targetSlot = 'helmet';
                      else if (selectedItem.item.itemClass.includes('Body Armour')) targetSlot = 'bodyArmour';
                      else if (selectedItem.item.itemClass.includes('Gloves')) targetSlot = 'gloves';
                      else if (selectedItem.item.itemClass.includes('Boots')) targetSlot = 'boots';
                      else if (selectedItem.item.itemClass.includes('Ring')) targetSlot = 'ring1';
                      else if (selectedItem.item.itemClass.includes('Amulet')) targetSlot = 'amulet';
                      else if (selectedItem.item.itemClass.includes('Belt')) targetSlot = 'belt';
                      onEquipItem(selectedItem.invIndex!, targetSlot);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-emerald-700/80 hover:bg-emerald-600 text-white font-semibold text-xs transition"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Equip Item</span>
                  </button>
                )}

                <button
                  onClick={() => onAskAiAboutItem(selectedItem.item)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-amber-600/80 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI Advisor</span>
                </button>
              </div>
            </div>

            {/* Combat Stats (DPS, Physical, Evasion, etc.) */}
            {selectedItem.item.stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-900/80 p-2.5 rounded border border-zinc-800 text-[11px]">
                {selectedItem.item.stats.dps && (
                  <div>
                    <span className="text-zinc-500 block">Weapon DPS</span>
                    <span className="font-bold text-amber-400 text-sm">{selectedItem.item.stats.dps}</span>
                  </div>
                )}
                {selectedItem.item.stats.physicalDamage && (
                  <div>
                    <span className="text-zinc-500 block">Damage</span>
                    <span className="font-bold text-zinc-200">{selectedItem.item.stats.physicalDamage}</span>
                  </div>
                )}
                {selectedItem.item.stats.attacksPerSecond && (
                  <div>
                    <span className="text-zinc-500 block">Attacks/Sec</span>
                    <span className="font-bold text-zinc-200">{selectedItem.item.stats.attacksPerSecond}</span>
                  </div>
                )}
                {selectedItem.item.stats.criticalStrikeChance && (
                  <div>
                    <span className="text-zinc-500 block">Crit Chance</span>
                    <span className="font-bold text-zinc-200">{selectedItem.item.stats.criticalStrikeChance}</span>
                  </div>
                )}
                {selectedItem.item.stats.evasion && (
                  <div>
                    <span className="text-zinc-500 block">Evasion</span>
                    <span className="font-bold text-emerald-400">{selectedItem.item.stats.evasion}</span>
                  </div>
                )}
                {selectedItem.item.stats.energyShield && (
                  <div>
                    <span className="text-zinc-500 block">Energy Shield</span>
                    <span className="font-bold text-cyan-400">{selectedItem.item.stats.energyShield}</span>
                  </div>
                )}
              </div>
            )}

            {/* Sockets & PoE2 Runes */}
            {(selectedItem.item.sockets || selectedItem.item.runeSockets) && (
              <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-[11px] bg-zinc-900/40 p-2 rounded">
                {selectedItem.item.sockets && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500">Sockets:</span>
                    <span className="text-zinc-200 font-semibold">{selectedItem.item.sockets} Skill Sockets</span>
                  </div>
                )}
                {selectedItem.item.runeSockets && (
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Zap className="w-3 h-3" />
                    <span>Rune Sockets: {selectedItem.item.runeSockets}</span>
                  </div>
                )}
              </div>
            )}

            {/* Slotted Runes details */}
            {selectedItem.item.runesSlotted && selectedItem.item.runesSlotted.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                  Engraved Runes
                </span>
                {selectedItem.item.runesSlotted.map((r, i) => (
                  <div key={i} className="text-[11px] text-amber-200/90 pl-2 border-l-2 border-amber-500/60">
                    {r}
                  </div>
                ))}
              </div>
            )}

            {/* Implicits */}
            {selectedItem.item.implicitMods && selectedItem.item.implicitMods.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Implicit Modifiers
                </span>
                {selectedItem.item.implicitMods.map((mod, i) => (
                  <div key={i} className="text-[11px] text-sky-300 font-medium">
                    {mod}
                  </div>
                ))}
              </div>
            )}

            {/* Explicits */}
            {selectedItem.item.explicitMods && selectedItem.item.explicitMods.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-zinc-800/80">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Explicit Modifiers
                </span>
                {selectedItem.item.explicitMods.map((mod, i) => (
                  <div key={i} className="text-[11px] text-zinc-200">
                    {mod}
                  </div>
                ))}
              </div>
            )}

            {/* Flavor Text */}
            {selectedItem.item.flavorText && (
              <div className="text-[11px] italic text-amber-400/70 pt-2 border-t border-zinc-800/60 font-serif">
                "{selectedItem.item.flavorText}"
              </div>
            )}
          </div>
        ) : (
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-6 text-center text-zinc-500 text-xs flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            <span>Select any item in your paperdoll or bag to view detailed affixes, rune engravings, and stats.</span>
          </div>
        )}
      </div>
    </div>
  );
}
