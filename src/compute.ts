import 'regenerator-runtime/runtime';

import { List, Map, Set, Range } from 'immutable';
import { Enchantment, ENCHANTMENT_DATA } from './enchantments';

interface Component {
  name: string;
  maxLevelCost: number;
}

type Memo = Map<Set<Component>, Map<number, Item>>;

function makeComponent(name: string, maxLevelCost: number): Component {
  return { name, maxLevelCost };
}

const COMPONENTS: { [_: string]: Component } = {
  BASE: makeComponent('Base', 0),
  UNBREAKING: makeComponent('Unbreaking', 3 * 1),
  LOOTING: makeComponent('Looting', 3 * 2),
  SWEEPING_EDGE: makeComponent('Sweeping Edge', 3 * 2),
  SHARPNESS: makeComponent('Sharpness', 5 * 1),
  KNOCKBACK: makeComponent('Looting', 2 * 1),
  FIRE_ASPECT: makeComponent('Looting', 2 * 2),
  MENDING: makeComponent('Looting', 1 * 2),
};

interface Item {
  enchants: Set<Component>;
  workCount: number;
  enchantLevelCost: number;
  combineExpCost: number;
  completeExpCost: number;
  target?: Item;
  sac?: Item;
}

const SENTINEL_ITEM: Item = {
  enchants: Set(),
  workCount: 0,
  enchantLevelCost: 0,
  combineExpCost: 0,
  completeExpCost: Infinity,
};

function workPenalty(workCount: number): number {
  return Math.pow(2, workCount) - 1;
}

function levelToExp(level: number): number {
  if (level <= 16) return level * level + 6 * level;
  if (level <= 31) return 2.5 * level * level - 40.5 * level + 360;
  return 4.5 * level * level + 162.5 * level + 2220;
}

function combine(target: Item, sac: Item): Item {
  const combineLevelCost =
    sac.enchantLevelCost +
    workPenalty(target.workCount) +
    workPenalty(sac.workCount);
  const combineExpCost = levelToExp(combineLevelCost);
  const workCount = Math.max(target.workCount, sac.workCount) + 1;
  return {
    enchants: target.enchants.union(sac.enchants),
    workCount,
    enchantLevelCost: target.enchantLevelCost + sac.enchantLevelCost,
    combineExpCost,
    completeExpCost:
      target.completeExpCost + sac.completeExpCost + combineExpCost,
    target,
    sac,
  };
}

function* combinations<T>(
  vals: List<T>,
  size: number
): IterableIterator<List<T>> {
  const n = vals.size;
  console.assert(size <= n);
  const indices = Range(0, size).toArray();
  yield List(indices.map((i) => vals.get(i)!));
  while (true) {
    let broke = false;
    let i = 0;
    for (i of Range(size - 1, -1)) {
      if (indices[i] !== i + n - size) {
        broke = true;
        break;
      }
    }
    if (!broke) return;

    indices[i] += 1;
    for (let j of Range(i + 1, size)) {
      indices[j] = indices[j - 1] + 1;
    }
    yield List(indices.map((i) => vals.get(i)!));
  }
}

function* nonemptyPartitions<T>(vals: List<T>): IterableIterator<Set<T>> {
  console.assert(vals.size > 1);
  let head = vals.get(0)!;
  let tail = vals.slice(1);
  for (let cellSize = 0; cellSize < vals.size - 1; cellSize++) {
    for (let leftCell of combinations(tail, cellSize)) {
      yield Set<T>(leftCell).add(head);
    }
  }
}

function hasBaseItem(item: Item): boolean {
  return item.enchants.has(COMPONENTS.BASE);
}

function* combinedItems(
  goalEnchants: List<Component>,
  memo: Memo
): IterableIterator<Item> {
  const goalSet = Set(goalEnchants);
  for (let leftCell of nonemptyPartitions(goalEnchants)) {
    const rightCell = goalSet.subtract(leftCell);
    for (let leftItem of memo.get(leftCell)!.values()) {
      if (leftItem === SENTINEL_ITEM) continue;
      for (let rightItem of memo.get(rightCell)!.values()) {
        if (rightItem === SENTINEL_ITEM) continue;
        if (hasBaseItem(leftItem)) {
          yield combine(leftItem, rightItem);
        } else if (hasBaseItem(rightItem)) {
          yield combine(rightItem, leftItem);
        } else if (leftItem.enchantLevelCost < rightItem.enchantLevelCost) {
          yield combine(rightItem, leftItem);
        } else {
          yield combine(leftItem, rightItem);
        }
      }
    }
  }
}

function computeOptimalItem(enchants: List<Component>): Item {
  let memo: Memo = Map<Set<Component>, Map<number, Item>>().asMutable();
  for (let enchant of enchants) {
    const singleton = Set([enchant]);
    memo.set(
      singleton,
      Map([
        [
          0,
          {
            enchants: singleton,
            workCount: 0,
            enchantLevelCost: enchant.maxLevelCost,
            combineExpCost: 0,
            completeExpCost: 0,
          },
        ],
      ])
    );
  }

  for (let subsetSize of Range(2, enchants.size + 1)) {
    const depthRange = List(Range(0, subsetSize));
    for (let goalEnchants of combinations(enchants, subsetSize)) {
      const goalSet = Set(goalEnchants);
      memo.set(goalSet, Map(depthRange.map((depth) => [depth, SENTINEL_ITEM])));
      for (let combinedItem of combinedItems(goalEnchants, memo)) {
        let currentBestCost = memo.getIn([goalSet, combinedItem.workCount])
          .completeExpCost;
        if (combinedItem.completeExpCost < currentBestCost) {
          memo.setIn([goalSet, combinedItem.workCount], combinedItem);
        }
      }
    }
  }

  const candidateItems = List(memo.get(Set(enchants))!.values());
  return candidateItems.minBy((item) => item.completeExpCost)!;
}

export function compute(enchants: List<Enchantment>): Item {
  let components = enchants
    .map((enchant) => {
      const data = ENCHANTMENT_DATA.get(enchant)!;
      return makeComponent(data.name, data.maxLevel * data.costMultiplier);
    })
    .push(COMPONENTS.BASE);
  return computeOptimalItem(components);
}

function benchmark() {
  const trials = 20;
  let optimal;
  const startTime = Date.now();
  for (let i = 0; i < trials; i++) {
    optimal = computeOptimalItem(
      List([
        COMPONENTS.BASE,
        COMPONENTS.SWEEPING_EDGE,
        COMPONENTS.LOOTING,
        COMPONENTS.UNBREAKING,
        COMPONENTS.KNOCKBACK,
        COMPONENTS.FIRE_ASPECT,
        COMPONENTS.MENDING,
        COMPONENTS.SHARPNESS,
      ])
    );
  }
  const endTime = Date.now();

  const elapsed = endTime - startTime;
  const average = elapsed / trials;
  console.log('elapsed (ms):', endTime - startTime);
  console.log('average (ms):', average);
  console.log('optimal:', optimal);
}
