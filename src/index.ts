import { List, Map } from 'immutable';

import { Enchantment, ENCHANTMENT_DATA } from './enchantments';
import { compute } from './compute';

const YEP = [
  Enchantment.SWEEPING_EDGE,
  Enchantment.LOOTING,
  Enchantment.UNBREAKING,
  Enchantment.KNOCKBACK,
  Enchantment.FIRE_ASPECT,
  Enchantment.MENDING,
  Enchantment.SHARPNESS,
];

interface EnchantmentInput {
  container: HTMLElement,
  checkbox: HTMLInputElement,
  enabled: boolean,
}

const enchantmentsEl = document.getElementById('enchantments')!;
const enchantmentInputs: Map<Enchantment, EnchantmentInput> = ENCHANTMENT_DATA.map((enchantmentData, enchantment) => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  if (YEP.indexOf(enchantment) !== -1) {
    checkbox.checked = true;
  }
  const label = document.createElement('label');
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(ENCHANTMENT_DATA.get(enchantment)!.name));

  const container = document.createElement('p');
  container.appendChild(label);

  return {
    container,
    checkbox,
    enabled: false,
  };
});

document.getElementById('go')!.onclick = function() {
  const startTime = Date.now();
  const enchantments = List(enchantmentInputs
    .filter(input => input.enabled && input.checkbox.checked)
    .keys());
  const optimum = compute(enchantments);
  const endTime = Date.now();
  console.log('optimum:', optimum);
  console.log('elapsed (ms):', endTime - startTime);
};
