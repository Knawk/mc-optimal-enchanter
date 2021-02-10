import { List, Map, Set } from 'immutable';

import { Enchantment, ENCHANTMENT_DATA } from './enchantments';

export enum BaseItem {
  // Armor
  Helmet = 'HELMET',
  Chestplate = 'CHESTPLATE',
  Leggings = 'LEGGINGS',
  Boots = 'BOOTS',
  Elytra = 'ELYTRA',

  // Combat
  Sword = 'SWORD',
  Bow = 'BOW',
  Crossbow = 'CROSSBOW',
  Trident = 'TRIDENT',
  Shield = 'SHIELD',

  // Tools
  Pickaxe = 'PICKAXE',
  Axe = 'AXE',
  Shovel = 'SHOVEL',
  Hoe = 'HOE',
  FishingRod = 'FISHING_ROD',
  Shears = 'SHEARS',
  FlintSteel = 'FLINT_STEEL',
  CarrotOnAStick = 'CARROT_STICK',
  WarpedFungusOnAStick = 'WARPED_FUNGUS_STICK',
}

export const ARMOR_BASE_ITEMS: List<BaseItem> = List([
  BaseItem.Helmet,
  BaseItem.Chestplate,
  BaseItem.Leggings,
  BaseItem.Boots,
]);

export const WEARABLE_BASE_ITEMS: List<BaseItem> = ARMOR_BASE_ITEMS.push(
  BaseItem.Elytra
);

export const COMBAT_BASE_ITEMS: List<BaseItem> = List([
  BaseItem.Sword,
  BaseItem.Bow,
  BaseItem.Crossbow,
  BaseItem.Trident,
  BaseItem.Shield,
]);

const PRIMARY_TOOL_BASE_ITEMS: List<BaseItem> = List([
  BaseItem.Pickaxe,
  BaseItem.Axe,
  BaseItem.Shovel,
  BaseItem.Hoe,
]);

export const TOOL_BASE_ITEMS: List<BaseItem> = PRIMARY_TOOL_BASE_ITEMS.concat([
  BaseItem.FishingRod,
  BaseItem.Shears,
  BaseItem.FlintSteel,
  BaseItem.CarrotOnAStick,
  BaseItem.WarpedFungusOnAStick,
]);

export const BASE_ITEM_NAMES: Map<BaseItem, string> = Map([
  [BaseItem.Helmet, 'Helmet'],
  [BaseItem.Chestplate, 'Chestplate'],
  [BaseItem.Leggings, 'Leggings'],
  [BaseItem.Boots, 'Boots'],
  [BaseItem.Elytra, 'Elytra'],
  [BaseItem.Sword, 'Sword'],
  [BaseItem.Bow, 'Bow'],
  [BaseItem.Crossbow, 'Crossbow'],
  [BaseItem.Trident, 'Trident'],
  [BaseItem.Shield, 'Shield'],
  [BaseItem.Pickaxe, 'Pickaxe'],
  [BaseItem.Axe, 'Axe'],
  [BaseItem.Shovel, 'Shovel'],
  [BaseItem.Hoe, 'Hoe'],
  [BaseItem.FishingRod, 'Fishing Rod'],
  [BaseItem.Shears, 'Shears'],
  [BaseItem.FlintSteel, 'Flint and Steel'],
  [BaseItem.CarrotOnAStick, 'Carrot on a Stick'],
  [BaseItem.WarpedFungusOnAStick, 'Warped Fungus on a Stick'],
]);

export function getCompatibleEnchantments(
  baseItem: BaseItem
): Set<Enchantment> {
  // These are always compatible
  const enchantments = List([
    Enchantment.Unbreaking,
    Enchantment.Mending,
    Enchantment.CurseOfVanishing,
  ]).asMutable();

  // Wearables

  if (ARMOR_BASE_ITEMS.indexOf(baseItem) !== -1) {
    enchantments.concat([
      Enchantment.Protection,
      Enchantment.FireProtection,
      Enchantment.BlastProtection,
      Enchantment.ProjectileProtection,
      Enchantment.Thorns,
    ]);
  }

  if (baseItem === BaseItem.Helmet) {
    enchantments.concat([Enchantment.AquaAffinity, Enchantment.Respiration]);
  }

  if (baseItem === BaseItem.Boots) {
    enchantments.concat([
      Enchantment.DepthStrider,
      Enchantment.FrostWalker,
      Enchantment.SoulSpeed,
    ]);
  }

  if (WEARABLE_BASE_ITEMS.indexOf(baseItem) !== -1) {
    enchantments.push(Enchantment.CurseOfBinding);
  }

  // Combat

  if (baseItem === BaseItem.Sword || baseItem === BaseItem.Axe) {
    enchantments.concat([
      Enchantment.Sharpness,
      Enchantment.Smite,
      Enchantment.BaneOfArthropods,
    ]);
  }

  if (baseItem === BaseItem.Sword) {
    enchantments.concat([
      Enchantment.Knockback,
      Enchantment.FireAspect,
      Enchantment.Looting,
      Enchantment.SweepingEdge,
    ]);
  }

  if (baseItem === BaseItem.Bow) {
    enchantments.concat([
      Enchantment.Power,
      Enchantment.Punch,
      Enchantment.Flame,
      Enchantment.Infinity,
    ]);
  }

  if (baseItem === BaseItem.Crossbow) {
    enchantments.concat([
      Enchantment.Multishot,
      Enchantment.Piercing,
      Enchantment.QuickCharge,
    ]);
  }

  if (baseItem === BaseItem.Trident) {
    enchantments.concat([
      Enchantment.Impaling,
      Enchantment.Riptide,
      Enchantment.Loyalty,
      Enchantment.Channeling,
    ]);
  }

  // Tools

  if (PRIMARY_TOOL_BASE_ITEMS.indexOf(baseItem) !== -1) {
    enchantments.concat([
      Enchantment.Efficiency,
      Enchantment.SilkTouch,
      Enchantment.Fortune,
    ]);
  }

  if (baseItem === BaseItem.Shears) {
    enchantments.push(Enchantment.Efficiency);
  }

  if (baseItem === BaseItem.FishingRod) {
    enchantments.concat([Enchantment.Lure, Enchantment.LuckOfTheSea]);
  }

  return Set(enchantments);
}
