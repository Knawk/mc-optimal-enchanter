import { List } from 'immutable';

import { Enchantment, ENCHANTMENTS } from './enchantments';
import { compute } from './compute';

const enchantmentsEl = document.getElementById('enchantments')!;
for (let enchantmentId in ENCHANTMENTS) {
  const checkboxEl = document.createElement('input');
  checkboxEl.type = 'checkbox';
  checkboxEl.name = enchantmentId;
  checkboxEl.classList.add('enchantmentCheckbox');
  const labelEl = document.createElement('label');
  labelEl.appendChild(checkboxEl);
  labelEl.appendChild(document.createTextNode(ENCHANTMENTS[enchantmentId].name));
  const parEl = document.createElement('p');
  parEl.appendChild(labelEl);
  enchantmentsEl.appendChild(parEl);
}

document.getElementById('go')!.onclick = function() {
  const checkboxes: List<HTMLInputElement> = List(enchantmentsEl.querySelectorAll('.enchantmentCheckbox'));
  const enchantmentIds = checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.name);
  const optimum = compute(enchantmentIds.map(id => ENCHANTMENTS[id]));
  console.log('optimum:', optimum);
};
