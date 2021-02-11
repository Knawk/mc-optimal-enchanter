import { List, Map, Set, Range } from 'immutable';

export enum Enchantment {
  Protection = 'PROT',
  FireProtection = 'FIRE_PROT',
  FeatherFalling = 'FEATHER_FALLING',
  BlastProtection = 'BLAST_PROT',
  ProjectileProtection = 'PROJ_PROT',
  Thorns = 'THORNS',
  Respiration = 'RESPIRATION',
  DepthStrider = 'DEPTH_STRIDER',
  AquaAffinity = 'AQUA_AFFINITY',
  Sharpness = 'SHARPNESS',
  Smite = 'SMITE',
  BaneOfArthropods = 'BANE_ARTHRO',
  Knockback = 'KNOCKBACK',
  FireAspect = 'FIRE_ASPECT',
  Looting = 'LOOTING',
  Efficiency = 'EFFICIENCY',
  SilkTouch = 'SILK_TOUCH',
  Unbreaking = 'UNBREAKING',
  Fortune = 'FORTUNE',
  Power = 'POWER',
  Punch = 'PUNCH',
  Flame = 'FLAME',
  Infinity = 'INFINITY',
  LuckOfTheSea = 'LUCK_SEA',
  Lure = 'LURE',
  FrostWalker = 'FROST_WALKER',
  Mending = 'MENDING',
  CurseOfBinding = 'CURSE_BINDING',
  CurseOfVanishing = 'CURSE_VANISHING',
  Impaling = 'IMPALING',
  Riptide = 'RIPTIDE',
  Loyalty = 'LOYALTY',
  Channeling = 'CHANNELING',
  Multishot = 'MULTISHOT',
  Piercing = 'PIERCING',
  QuickCharge = 'QUICK_CHARGE',
  SoulSpeed = 'SOUL_SPEED',
  SweepingEdge = 'SWEEPING_EDGE',
}

export interface EnchantmentData {
  name: string;
  maxLevel: number;
  costMultiplier: number;
}

function enchantmentData(
  name: string,
  maxLevel: number,
  costMultiplier: number
): EnchantmentData {
  return { name, maxLevel, costMultiplier };
}

// Data from https://minecraft.gamepedia.com/Anvil_mechanics#Costs_for_combining_enchantments
export const ENCHANTMENT_DATA: Map<Enchantment, EnchantmentData> = Map([
  [Enchantment.Protection, enchantmentData('Protection', 4, 1)],
  [Enchantment.FireProtection, enchantmentData('Fire Protection', 4, 1)],
  [Enchantment.FeatherFalling, enchantmentData('Feather Falling', 4, 1)],
  [Enchantment.BlastProtection, enchantmentData('Blast Protection', 4, 2)],
  [
    Enchantment.ProjectileProtection,
    enchantmentData('Projectile Protection', 4, 1),
  ],
  [Enchantment.Thorns, enchantmentData('Thorns', 3, 4)],
  [Enchantment.Respiration, enchantmentData('Respiration', 3, 2)],
  [Enchantment.DepthStrider, enchantmentData('Depth Strider', 3, 2)],
  [Enchantment.AquaAffinity, enchantmentData('Aqua Affinity', 1, 2)],
  [Enchantment.Sharpness, enchantmentData('Sharpness', 5, 1)],
  [Enchantment.Smite, enchantmentData('Smite', 5, 1)],
  [Enchantment.BaneOfArthropods, enchantmentData('Bane of Arthropods', 5, 1)],
  [Enchantment.Knockback, enchantmentData('Knockback', 2, 1)],
  [Enchantment.FireAspect, enchantmentData('Fire Aspect', 2, 2)],
  [Enchantment.Looting, enchantmentData('Looting', 3, 2)],
  [Enchantment.Efficiency, enchantmentData('Efficiency', 5, 1)],
  [Enchantment.SilkTouch, enchantmentData('Silk Touch', 1, 4)],
  [Enchantment.Unbreaking, enchantmentData('Unbreaking', 3, 1)],
  [Enchantment.Fortune, enchantmentData('Fortune', 3, 2)],
  [Enchantment.Power, enchantmentData('Power', 5, 1)],
  [Enchantment.Punch, enchantmentData('Punch', 2, 2)],
  [Enchantment.Flame, enchantmentData('Flame', 1, 2)],
  [Enchantment.Infinity, enchantmentData('Infinity', 1, 4)],
  [Enchantment.LuckOfTheSea, enchantmentData('Luck of the Sea', 3, 2)],
  [Enchantment.Lure, enchantmentData('Lure', 3, 2)],
  [Enchantment.FrostWalker, enchantmentData('Frost Walker', 2, 2)],
  [Enchantment.Mending, enchantmentData('Mending', 1, 2)],
  [Enchantment.CurseOfBinding, enchantmentData('Curse of Binding', 1, 4)],
  [Enchantment.CurseOfVanishing, enchantmentData('Curse of Vanishing', 1, 4)],
  [Enchantment.Impaling, enchantmentData('Impaling', 5, 2)],
  [Enchantment.Riptide, enchantmentData('Riptide', 3, 2)],
  [Enchantment.Loyalty, enchantmentData('Loyalty', 3, 1)],
  [Enchantment.Channeling, enchantmentData('Channeling', 1, 4)],
  [Enchantment.Multishot, enchantmentData('Multishot', 1, 2)],
  [Enchantment.Piercing, enchantmentData('Piercing', 4, 1)],
  [Enchantment.QuickCharge, enchantmentData('Quick Charge', 3, 1)],
  [Enchantment.SoulSpeed, enchantmentData('Soul Speed', 3, 4)],
  [Enchantment.SweepingEdge, enchantmentData('Sweeping Edge', 3, 2)],
]);

const MUTUAL_EXCLUSION_SETS: List<Set<Enchantment>> = List([
  Set([Enchantment.BaneOfArthropods, Enchantment.Smite, Enchantment.Sharpness]),
  Set([
    Enchantment.Protection,
    Enchantment.BlastProtection,
    Enchantment.FireProtection,
    Enchantment.ProjectileProtection,
  ]),
  // Loyalty and Channeling are each mutually exclusive from Riptide, but not
  // from each other.
  Set([Enchantment.Loyalty, Enchantment.Riptide]),
  Set([Enchantment.Channeling, Enchantment.Riptide]),
  Set([Enchantment.DepthStrider, Enchantment.FrostWalker]),
  Set([Enchantment.Fortune, Enchantment.SilkTouch]),
  Set([Enchantment.Infinity, Enchantment.Mending]),
  Set([Enchantment.Multishot, Enchantment.Piercing]),
]);

const LEVEL_DISPLAY = Map([
  [0, ' '],
  [1, 'I'],
  [2, 'II'],
  [3, 'III'],
  [4, 'IV'],
  [5, 'V'],
]);

export function formatEnchantment(enchantment: Enchantment): string {
  return ENCHANTMENT_DATA.get(enchantment)!.name;
}

export function formatEnchantmentLevel(level: number): string {
  return LEVEL_DISPLAY.get(level, '?');
}

export interface LeveledEnchantment {
  enchantment: Enchantment;
  level: number;
}

export function formatLeveledEnchantment({
  enchantment,
  level,
}: LeveledEnchantment) {
  const levelText =
    ENCHANTMENT_DATA.get(enchantment)!.maxLevel > 1
      ? ` ${formatEnchantmentLevel(level)}`
      : '';
  return formatEnchantment(enchantment) + levelText;
}
