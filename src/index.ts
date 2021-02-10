import { List, Map } from 'immutable';

import { Enchantment, ENCHANTMENT_DATA } from './enchantments';
import { compute } from './compute';
import {
  BaseItem,
  WEARABLE_BASE_ITEMS,
  COMBAT_BASE_ITEMS,
  TOOL_BASE_ITEMS,
  BASE_ITEM_NAMES,
} from './baseItems';

const YEP = [
  Enchantment.SweepingEdge,
  Enchantment.Looting,
  Enchantment.Unbreaking,
  Enchantment.Knockback,
  Enchantment.FireAspect,
  Enchantment.Mending,
  Enchantment.Sharpness,
];

interface EnchantmentInput {
  container: HTMLElement;
  checkbox: HTMLInputElement;
  enabled: boolean;
}

const enchantmentInputs: Map<
  Enchantment,
  EnchantmentInput
> = ENCHANTMENT_DATA.map((enchantmentData, enchantment) => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  if (YEP.indexOf(enchantment) !== -1) {
    checkbox.checked = true;
  }
  const label = document.createElement('label');
  label.appendChild(checkbox);
  label.appendChild(
    document.createTextNode(ENCHANTMENT_DATA.get(enchantment)!.name)
  );

  const container = document.createElement('p');
  container.appendChild(label);

  return {
    container,
    checkbox,
    enabled: false,
  };
});

document.getElementById('go')!.onclick = function () {
  const startTime = Date.now();
  const enchantments = List(
    enchantmentInputs
      .filter((input) => input.enabled && input.checkbox.checked)
      .keys()
  );
  const optimum = compute(enchantments);
  const endTime = Date.now();
  console.log('optimum:', optimum);
  console.log('elapsed (ms):', endTime - startTime);
};

const enchantmentsContainer = document.getElementById(
  'enchantmentsContainer'
) as HTMLElement;
const baseItemSelect = document.getElementById(
  'baseItemSelect'
) as HTMLInputElement;
baseItemSelect.onchange = function () {
  renderEnchantmentsContainer();
};

function initialRender() {
  const baseItems = List([
    ...WEARABLE_BASE_ITEMS,
    ...COMBAT_BASE_ITEMS,
    ...TOOL_BASE_ITEMS,
  ]).sortBy((baseItem) => BASE_ITEM_NAMES.get(baseItem)!);
  for (let baseItem of baseItems) {
    const option = document.createElement('option');
    option.value = baseItem;
    option.innerText = BASE_ITEM_NAMES.get(baseItem)!;
    baseItemSelect.appendChild(option);
  }

  renderEnchantmentsContainer();
}

function renderEnchantmentsContainer() {
  const baseItem = baseItemSelect.value as BaseItem;
  console.log(baseItem);
}

initialRender();
