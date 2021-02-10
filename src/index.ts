import { List, Map } from 'immutable';

import { Enchantment, ENCHANTMENT_DATA } from './enchantments';
import { compute } from './compute';
import {
  BaseItem,
  WEARABLE_BASE_ITEMS,
  COMBAT_BASE_ITEMS,
  TOOL_BASE_ITEMS,
  BASE_ITEM_NAMES,
  getCompatibleEnchantments,
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
  container.classList.add('enchantmentContainer');
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
  console.log(enchantments.toArray());
  const optimum = compute(enchantments);
  const endTime = Date.now();
  console.log('optimum:', optimum);
  console.log('elapsed (ms):', endTime - startTime);
};

const enchantmentsList = document.getElementById(
  'enchantmentsList'
) as HTMLElement;
const baseItemSelect = document.getElementById(
  'baseItemSelect'
) as HTMLInputElement;
baseItemSelect.onchange = function () {
  renderEnchantmentsList();
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

  ENCHANTMENT_DATA.sortBy(data => data.name).forEach((data, enchantment) => {
    enchantmentsList.appendChild(enchantmentInputs.get(enchantment)!.container);
  });

  renderEnchantmentsList();
}

function renderEnchantmentsList() {
  const baseItem = baseItemSelect.value as BaseItem;
  const compatibleEnchantments = getCompatibleEnchantments(baseItem);
  enchantmentInputs.forEach((input, enchantment) => {
    const isCompatible = compatibleEnchantments.has(enchantment);
    input.enabled = isCompatible;
    input.container.classList.toggle('enabled', isCompatible);
  });
}

initialRender();
