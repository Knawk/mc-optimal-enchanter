import { List, Map, Set, Range } from 'immutable';

export interface Enchantment {
  name: string,
  maxLevel: number,
  costMultiplier: number,
}

function enchantment(name: string, maxLevel: number, costMultiplier: number): Enchantment {
  return { name, maxLevel, costMultiplier };
}

// Data from https://minecraft.gamepedia.com/Anvil_mechanics#Costs_for_combining_enchantments
export const ENCHANTMENTS: { [_: string]: Enchantment } = {
  PROT: enchantment('Protection', 4, 1),
  FIRE_PROT: enchantment('Fire Protection', 4, 1),
  FEATHER_FALLING: enchantment('Feather Falling', 4, 1),
  BLAST_PROT: enchantment('Blast Protection', 4, 2),
  PROJ_PROT: enchantment('Projectile Protection', 4, 1),
  THORNS: enchantment('Thorns', 3, 4),
  RESPIRATION: enchantment('Respiration', 3, 2),
  DEPTH_STRIDER: enchantment('Depth Strider', 3, 2),
  AQUA_AFFINITY: enchantment('Aqua Affinity', 1, 2),
  SHARPNESS: enchantment('Sharpness', 5, 1),
  SMITE: enchantment('Smite', 5, 1),
  BANE_ARTHRO: enchantment('Bane of Arthropods', 5, 1),
  KNOCKBACK: enchantment('Knockback', 2, 1),
  FIRE_ASPECT: enchantment('Fire Aspect', 2 , 2),
  LOOTING: enchantment('Looting', 3, 2),
  EFFICIENCY: enchantment('Efficiency', 5, 1),
  SILK_TOUCH: enchantment('Silk Touch', 1, 4),
  UNBREAKING: enchantment('Unbreaking', 3, 1),
  FORTUNE: enchantment('Fortune', 3, 2),
  POWER: enchantment('Power', 5, 1),
  PUNCH: enchantment('Punch', 2, 2),
  FLAME: enchantment('Flame', 1, 2),
  INFINITY: enchantment('Infinity', 1, 4),
  LUCK_SEA: enchantment('Luck of the Sea', 3, 2),
  LURE: enchantment('Lure', 3, 2),
  FROST_WALKER: enchantment('Frost Walker', 2, 2),
  MENDING: enchantment('Mending', 1 , 2),
  CURSE_BINDING: enchantment('Curse of Binding', 1, 4),
  CURSE_VANISHING: enchantment('Curse of Vanishing', 1, 4),
  IMPALING: enchantment('Impaling', 5, 2),
  RIPTIDE: enchantment('Riptide', 3, 2),
  LOYALTY: enchantment('Loyalty', 3, 1),
  CHANNELING: enchantment('Channeling', 1, 4),
  MULTISHOT: enchantment('Multishot', 1, 2),
  PIERCING: enchantment('Piercing', 4, 1),
  QUICK_CHARGE: enchantment('Quick Charge', 3, 1),
  SOUL_SPEED: enchantment('Soul Speed', 3, 4),
  SWEEPING_EDGE: enchantment('Sweeping Edge', 3, 2),
};

const MUTUAL_EXCLUSION_SETS: List<Set<Enchantment>> = List([
  Set([
    ENCHANTMENTS.BANE_ARTHRO,
    ENCHANTMENTS.SMITE,
    ENCHANTMENTS.SHARPNESS,
  ]),
  Set([
    ENCHANTMENTS.PROT,
    ENCHANTMENTS.BLAST_PROT,
    ENCHANTMENTS.FIRE_PROT,
    ENCHANTMENTS.PROJ_PROT,
  ]),
  // Loyalty and Channeling are each mutually exclusive from Riptide, but not
  // from each other.
  Set([
    ENCHANTMENTS.LOYALTY,
    ENCHANTMENTS.RIPTIDE,
  ]),
  Set([
    ENCHANTMENTS.CHANNELING,
    ENCHANTMENTS.RIPTIDE,
  ]),
  Set([
    ENCHANTMENTS.DEPTH_STRIDER,
    ENCHANTMENTS.FROST_WALKER,
  ]),
  Set([
    ENCHANTMENTS.FORTUNE,
    ENCHANTMENTS.SILK_TOUCH,
  ]),
  Set([
    ENCHANTMENTS.INFINITY,
    ENCHANTMENTS.MENDING,
  ]),
  Set([
    ENCHANTMENTS.MULTISHOT,
    ENCHANTMENTS.PIERCING,
  ]),
])
