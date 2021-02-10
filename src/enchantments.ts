import { List, Map, Set, Range } from 'immutable';

export enum Enchantment {
  PROT,
  FIRE_PROT,
  FEATHER_FALLING,
  BLAST_PROT,
  PROJ_PROT,
  THORNS,
  RESPIRATION,
  DEPTH_STRIDER,
  AQUA_AFFINITY,
  SHARPNESS,
  SMITE,
  BANE_ARTHRO,
  KNOCKBACK,
  FIRE_ASPECT,
  LOOTING,
  EFFICIENCY,
  SILK_TOUCH,
  UNBREAKING,
  FORTUNE,
  POWER,
  PUNCH,
  FLAME,
  INFINITY,
  LUCK_SEA,
  LURE,
  FROST_WALKER,
  MENDING,
  CURSE_BINDING,
  CURSE_VANISHING,
  IMPALING,
  RIPTIDE,
  LOYALTY,
  CHANNELING,
  MULTISHOT,
  PIERCING,
  QUICK_CHARGE,
  SOUL_SPEED,
  SWEEPING_EDGE,
}

export interface EnchantmentData {
  name: string,
  maxLevel: number,
  costMultiplier: number,
}

function enchantmentData(name: string, maxLevel: number, costMultiplier: number): EnchantmentData {
  return { name, maxLevel, costMultiplier };
}

// Data from https://minecraft.gamepedia.com/Anvil_mechanics#Costs_for_combining_enchantments
export const ENCHANTMENT_DATA: Map<Enchantment, EnchantmentData> = Map([
  [Enchantment.PROT, enchantmentData('Protection', 4, 1)],
  [Enchantment.FIRE_PROT, enchantmentData('Fire Protection', 4, 1)],
  [Enchantment.FEATHER_FALLING, enchantmentData('Feather Falling', 4, 1)],
  [Enchantment.BLAST_PROT, enchantmentData('Blast Protection', 4, 2)],
  [Enchantment.PROJ_PROT, enchantmentData('Projectile Protection', 4, 1)],
  [Enchantment.THORNS, enchantmentData('Thorns', 3, 4)],
  [Enchantment.RESPIRATION, enchantmentData('Respiration', 3, 2)],
  [Enchantment.DEPTH_STRIDER, enchantmentData('Depth Strider', 3, 2)],
  [Enchantment.AQUA_AFFINITY, enchantmentData('Aqua Affinity', 1, 2)],
  [Enchantment.SHARPNESS, enchantmentData('Sharpness', 5, 1)],
  [Enchantment.SMITE, enchantmentData('Smite', 5, 1)],
  [Enchantment.BANE_ARTHRO, enchantmentData('Bane of Arthropods', 5, 1)],
  [Enchantment.KNOCKBACK, enchantmentData('Knockback', 2, 1)],
  [Enchantment.FIRE_ASPECT, enchantmentData('Fire Aspect', 2 , 2)],
  [Enchantment.LOOTING, enchantmentData('Looting', 3, 2)],
  [Enchantment.EFFICIENCY, enchantmentData('Efficiency', 5, 1)],
  [Enchantment.SILK_TOUCH, enchantmentData('Silk Touch', 1, 4)],
  [Enchantment.UNBREAKING, enchantmentData('Unbreaking', 3, 1)],
  [Enchantment.FORTUNE, enchantmentData('Fortune', 3, 2)],
  [Enchantment.POWER, enchantmentData('Power', 5, 1)],
  [Enchantment.PUNCH, enchantmentData('Punch', 2, 2)],
  [Enchantment.FLAME, enchantmentData('Flame', 1, 2)],
  [Enchantment.INFINITY, enchantmentData('Infinity', 1, 4)],
  [Enchantment.LUCK_SEA, enchantmentData('Luck of the Sea', 3, 2)],
  [Enchantment.LURE, enchantmentData('Lure', 3, 2)],
  [Enchantment.FROST_WALKER, enchantmentData('Frost Walker', 2, 2)],
  [Enchantment.MENDING, enchantmentData('Mending', 1 , 2)],
  [Enchantment.CURSE_BINDING, enchantmentData('Curse of Binding', 1, 4)],
  [Enchantment.CURSE_VANISHING, enchantmentData('Curse of Vanishing', 1, 4)],
  [Enchantment.IMPALING, enchantmentData('Impaling', 5, 2)],
  [Enchantment.RIPTIDE, enchantmentData('Riptide', 3, 2)],
  [Enchantment.LOYALTY, enchantmentData('Loyalty', 3, 1)],
  [Enchantment.CHANNELING, enchantmentData('Channeling', 1, 4)],
  [Enchantment.MULTISHOT, enchantmentData('Multishot', 1, 2)],
  [Enchantment.PIERCING, enchantmentData('Piercing', 4, 1)],
  [Enchantment.QUICK_CHARGE, enchantmentData('Quick Charge', 3, 1)],
  [Enchantment.SOUL_SPEED, enchantmentData('Soul Speed', 3, 4)],
  [Enchantment.SWEEPING_EDGE, enchantmentData('Sweeping Edge', 3, 2)],
]);

const MUTUAL_EXCLUSION_SETS: List<Set<Enchantment>> = List([
  Set([
    Enchantment.BANE_ARTHRO,
    Enchantment.SMITE,
    Enchantment.SHARPNESS,
  ]),
  Set([
    Enchantment.PROT,
    Enchantment.BLAST_PROT,
    Enchantment.FIRE_PROT,
    Enchantment.PROJ_PROT,
  ]),
  // Loyalty and Channeling are each mutually exclusive from Riptide, but not
  // from each other.
  Set([
    Enchantment.LOYALTY,
    Enchantment.RIPTIDE,
  ]),
  Set([
    Enchantment.CHANNELING,
    Enchantment.RIPTIDE,
  ]),
  Set([
    Enchantment.DEPTH_STRIDER,
    Enchantment.FROST_WALKER,
  ]),
  Set([
    Enchantment.FORTUNE,
    Enchantment.SILK_TOUCH,
  ]),
  Set([
    Enchantment.INFINITY,
    Enchantment.MENDING,
  ]),
  Set([
    Enchantment.MULTISHOT,
    Enchantment.PIERCING,
  ]),
])
