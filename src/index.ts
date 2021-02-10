import { List } from 'immutable';

import { Enchantment, ENCHANTMENTS } from './enchantments';
import { compute } from './compute';

const YEP = [
  ENCHANTMENTS.SWEEPING_EDGE,
  ENCHANTMENTS.LOOTING,
  ENCHANTMENTS.UNBREAKING,
  ENCHANTMENTS.KNOCKBACK,
  ENCHANTMENTS.FIRE_ASPECT,
  ENCHANTMENTS.MENDING,
  ENCHANTMENTS.SHARPNESS,
];

const enchantmentsEl = document.getElementById('enchantments')!;
for (let enchantmentId in ENCHANTMENTS) {
  const checkboxEl = document.createElement('input');
  checkboxEl.type = 'checkbox';
  checkboxEl.name = enchantmentId;
  checkboxEl.classList.add('enchantmentCheckbox');
  if (YEP.indexOf(ENCHANTMENTS[enchantmentId]) !== -1) {
    checkboxEl.checked = true;
  }
  const labelEl = document.createElement('label');
  labelEl.appendChild(checkboxEl);
  labelEl.appendChild(document.createTextNode(ENCHANTMENTS[enchantmentId].name));
  const parEl = document.createElement('p');
  parEl.appendChild(labelEl);
  enchantmentsEl.appendChild(parEl);
}

document.getElementById('go')!.onclick = function() {
  const startTime = Date.now();
  const checkboxes: List<HTMLInputElement> = List(enchantmentsEl.querySelectorAll('.enchantmentCheckbox'));
  const enchantmentIds = checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.name);
  const optimum = compute(enchantmentIds.map(id => ENCHANTMENTS[id]));
  const endTime = Date.now();
  console.log('optimum:', optimum);
  console.log('elapsed (ms):', endTime - startTime);
};
