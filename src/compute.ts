import 'regenerator-runtime/runtime';

import { List, Map, Set, Range, OrderedMap } from 'immutable';
import { Enchantment, ENCHANTMENT_DATA } from './enchantments';

interface Component {
  kind: 'Base' | Enchantment;
  maxLevelCost: number;
}

type Memo = Map<Set<Component>, Map<number, Item>>;

function makeComponent(kind: 'Base' | Enchantment, maxLevelCost: number): Component {
  return { kind, maxLevelCost };
}

const BASE_COMPONENT = makeComponent('Base', 0);

interface Item {
  comps: Set<Component>;
  workCount: number;
  enchantLevelCost: number;
  combineExpCost: number;
  completeExpCost: number;
  target?: Item;
  sac?: Item;
}

const SENTINEL_ITEM: Item = {
  comps: Set(),
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

const EXP_TO_LEVEL = Map(Range(0, 100).map(level => {
  // Must round because floating-point equality is bad news
  const exp = Math.round(levelToExp(level));
  return [exp, level];
}));

function combine(target: Item, sac: Item): Item {
  const combineLevelCost =
    sac.enchantLevelCost +
    workPenalty(target.workCount) +
    workPenalty(sac.workCount);
  const combineExpCost = levelToExp(combineLevelCost);
  const workCount = Math.max(target.workCount, sac.workCount) + 1;
  return {
    comps: target.comps.union(sac.comps),
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
  return item.comps.has(BASE_COMPONENT);
}

function* combinedItems(
  goalComps: List<Component>,
  memo: Memo
): IterableIterator<Item> {
  const goalSet = Set(goalComps);
  for (let leftCell of nonemptyPartitions(goalComps)) {
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

function computeOptimalItem(comps: List<Component>): Item {
  let memo: Memo = Map<Set<Component>, Map<number, Item>>().asMutable();
  for (let component of comps) {
    const singleton = Set([component]);
    memo.set(
      singleton,
      Map([
        [
          0,
          {
            comps: singleton,
            workCount: 0,
            enchantLevelCost: component.maxLevelCost,
            combineExpCost: 0,
            completeExpCost: 0,
          },
        ],
      ])
    );
  }

  for (let subsetSize of Range(2, comps.size + 1)) {
    const depthRange = List(Range(0, subsetSize));
    for (let goalComps of combinations(comps, subsetSize)) {
      const goalSet = Set(goalComps);
      memo.set(goalSet, Map(depthRange.map((depth) => [depth, SENTINEL_ITEM])));
      for (let combinedItem of combinedItems(goalComps, memo)) {
        let currentBestCost = memo.getIn([goalSet, combinedItem.workCount])
          .completeExpCost;
        if (combinedItem.completeExpCost < currentBestCost) {
          memo.setIn([goalSet, combinedItem.workCount], combinedItem);
        }
      }
    }
  }

  const candidateItems = List(memo.get(Set(comps))!.values());
  return candidateItems.minBy((item) => item.completeExpCost)!;
}

interface BaseBuildItem {
  kind: 'base',
}

interface EnchantmentBuildItem {
  kind: 'enchantment',
  enchantment: Enchantment,
}

interface StepBuildItem {
  kind: 'step',
  stepId: BuildStepId,
}

export type BuildItem = BaseBuildItem | EnchantmentBuildItem | StepBuildItem;

export type BuildStepId = string;

export interface BuildStep {
  stepId: BuildStepId,
  hasBase: boolean,
  enchantments: List<Enchantment>,
  target: BuildItem,
  sac: BuildItem,
  levelCost: number,
}

export type BuildPlan = Map<BuildStepId, BuildStep>;

const STEP_IDS = List('ABCDEFGHIJKL');

function toBuildItem(item: Item, itemStepIds: Map<Item, BuildStepId>): BuildItem {
  if (item.target === undefined && item.sac === undefined) {
    if (hasBaseItem(item)) return { kind: 'base' };
    return { kind: 'enchantment', enchantment: item.comps.first() as Enchantment };
  }
  console.assert(itemStepIds.has(item));
  return {
    kind: 'step',
    stepId: itemStepIds.get(item)!,
  };
}

function toBuildPlan(item: Item): BuildPlan {
  const queue: Item[] = [];
  function traverse(i: Item) {
    if (i.workCount < 1) return;
    queue.push(i);
    traverse(i.sac!);
    traverse(i.target!);
  }
  traverse(item);

  const itemsWithStepIds = List(queue).reverse().zip(STEP_IDS);
  const itemStepIds = OrderedMap(itemsWithStepIds);
  const buildSteps = itemStepIds.mapEntries(([item, stepId]) => [
    stepId,
    {
      stepId,
      hasBase: hasBaseItem(item),
      enchantments: item.comps.remove(BASE_COMPONENT).toList().map(comp => comp.kind as Enchantment).sort(),
      target: toBuildItem(item.target!, itemStepIds),
      sac: toBuildItem(item.sac!, itemStepIds),
      levelCost: EXP_TO_LEVEL.get(item.combineExpCost)!,
    }
  ]);

  return buildSteps;
}

export function build(enchantments: List<Enchantment>): BuildPlan {
  let components = enchantments
    .map((enchantment) => {
      const data = ENCHANTMENT_DATA.get(enchantment)!;
      return makeComponent(enchantment, data.maxLevel * data.costMultiplier);
    })
    .push(BASE_COMPONENT);
  return toBuildPlan(computeOptimalItem(components));
}
