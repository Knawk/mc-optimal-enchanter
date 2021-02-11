import { List, Map, Range } from 'immutable';
import m from 'mithril';

import { Enchantment, ENCHANTMENT_DATA } from './enchantments';
import {
  build,
  BuildPlan,
  BuildStep,
  BuildItem,
  EnchantmentChoice,
} from './build';
import {
  BaseItem,
  WEARABLE_BASE_ITEMS,
  COMBAT_BASE_ITEMS,
  TOOL_BASE_ITEMS,
  BASE_ITEM_NAMES,
  getCompatibleEnchantments,
} from './baseItems';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const ALL_BASE_ITEMS = List([
  ...WEARABLE_BASE_ITEMS,
  ...COMBAT_BASE_ITEMS,
  ...TOOL_BASE_ITEMS,
]).sortBy((baseItem) => BASE_ITEM_NAMES.get(baseItem)!);

interface InputModelProps {
  baseItem: BaseItem;
  enchantmentChoices: EnchantmentChoice[];
}

const InputModel: InputModelProps = {
  baseItem: BaseItem.Pickaxe,
  enchantmentChoices: ENCHANTMENT_DATA.sortBy((data) => data.name)
    .entrySeq()
    .map(([enchantment, data]) => ({
      enchantment,
      level: 0,
      name: data.name,
      maxLevel: data.maxLevel,
    }))
    .toArray(),
};

const BaseItemSelect = {
  view: function () {
    return m(
      'select.form-select',
      {
        id: 'baseItemSelect',
        onchange: function (e: any) {
          InputModel.baseItem = e.target.value;
        },
      },
      ALL_BASE_ITEMS.map((baseItem) =>
        m(
          'option',
          {
            value: baseItem,
            selected: baseItem === InputModel.baseItem,
          },
          BASE_ITEM_NAMES.get(baseItem)
        )
      ).toArray()
    );
  },
};

const LEVEL_DISPLAY = Map([
  [0, ' '],
  [1, 'I'],
  [2, 'II'],
  [3, 'III'],
  [4, 'IV'],
  [5, 'V'],
]);

const EnchantmentsList = {
  view: function () {
    const compatibleEnchantments = getCompatibleEnchantments(
      InputModel.baseItem
    );
    return m(
      'div',
      InputModel.enchantmentChoices.map((choice) => {
        const isCompatible = compatibleEnchantments.has(choice.enchantment);
        const data = ENCHANTMENT_DATA.get(choice.enchantment)!;
        return m(
          'p.enchantmentContainer',
          {
            class: isCompatible ? 'enabled' : '',
          },
          [
            m('label', [
              data.name,
              m(
                'select',
                {
                  onchange: function (e: any) {
                    choice.level = Number(e.target.value);
                  },
                },
                Range(0, data.maxLevel + 1)
                  .map((level) =>
                    m(
                      'option',
                      {
                        value: level,
                      },
                      LEVEL_DISPLAY.get(level)!
                    )
                  )
                  .toArray()
              ),
            ]),
          ]
        );
      })
    );
  },
};

const InputView = {
  view: function () {
    return m('div', [
      m('h3', 'Select item and enchantments'),
      m('form', [
        m('.row', [
          m('.col-12', [
            m('label', { for: 'baseItemSelect' }, 'Base item'),
            m(BaseItemSelect),
          ]),
          m('.col-12', ['with these enchantments', m(EnchantmentsList)]),
        ]),
      ]),
    ]);
  },
};

m.mount(document.getElementById('inputViewMount')!, InputView);

document.getElementById('go')!.onclick = function () {
  const startTime = Date.now();
  const choices = List(
    InputModel.enchantmentChoices.filter(({ level }) => level > 0)
  );
  const buildPlan = build(choices);
  const endTime = Date.now();
  console.log('elapsed (ms):', endTime - startTime);
  renderBuildPlan(buildPlan);
};

function renderBuildItem(buildItem: BuildItem): string {
  switch (buildItem.kind) {
    case 'base':
      return BASE_ITEM_NAMES.get(InputModel.baseItem)!;
    case 'enchantment':
      return ENCHANTMENT_DATA.get(buildItem.enchantment)!.name;
    case 'step':
      return buildItem.stepId;
    default:
      throw Error();
  }
}

function renderBuildPlan(buildPlan: BuildPlan) {
  for (let [stepId, buildStep] of buildPlan) {
    const targetRendered = renderBuildItem(buildStep.target);
    const sacRendered = renderBuildItem(buildStep.sac);
    console.log(
      `${stepId} = ${targetRendered} + ${sacRendered} (${buildStep.levelCost} levels)`
    );
  }
}
