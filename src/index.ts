import { List, Map, Range } from 'immutable';
import m from 'mithril';
import type { Vnode } from 'mithril';

import {
  Enchantment,
  ENCHANTMENT_DATA,
  formatEnchantment,
  formatEnchantmentLevel,
  formatLeveledEnchantment,
} from './enchantments';
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
  ALL_BASE_ITEMS,
  getCompatibleEnchantments,
} from './baseItems';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

interface ModelProps {
  baseItem: BaseItem;
  enchantmentChoices: EnchantmentChoice[];
  buildPlan: BuildPlan;
}

const Model: ModelProps = {
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
  buildPlan: Map(),
};

const BaseItemSelect = {
  view: function () {
    return m(
      'select.form-select',
      {
        id: 'baseItemSelect',
        onchange: function (e: any) {
          Model.baseItem = e.target.value;
        },
      },
      ALL_BASE_ITEMS.map((baseItem) =>
        m(
          'option',
          {
            value: baseItem,
            selected: baseItem === Model.baseItem,
          },
          BASE_ITEM_NAMES.get(baseItem)
        )
      ).toArray()
    );
  },
};

const EnchantmentsList = {
  view: function () {
    const compatibleEnchantments = getCompatibleEnchantments(Model.baseItem);
    return m(
      'div.row',
      Model.enchantmentChoices.map((choice) => {
        const isCompatible = compatibleEnchantments.has(choice.enchantment);
        const data = ENCHANTMENT_DATA.get(choice.enchantment)!;
        const selectId = `enchantmentSelect_${choice.enchantment}`;
        return m(
          '.col-sm-6.enchantmentContainer',
          {
            class: isCompatible ? '' : 'disabled',
          },
          [
            m('.input-group.mb-3', [
              m('label.input-group-text', { for: selectId }, [data.name]),
              m(
                'select.form-select',
                {
                  id: selectId,
                  onchange: function (e: any) {
                    choice.level = Number(e.target.value);
                  },
                },
                [0, ...Range(data.maxLevel, 0)].map((level) =>
                  m(
                    'option',
                    {
                      value: level,
                    },
                    formatEnchantmentLevel(level)
                  )
                )
              ),
            ]),
          ]
        );
      })
    );
  },
};

const BuildItemView = {
  view: function (vnode: Vnode<any, any>) {
    const buildItem = vnode.attrs.buildItem as BuildItem;
    switch (buildItem.kind) {
      case 'base':
        return BASE_ITEM_NAMES.get(Model.baseItem)!;
      case 'enchantment':
        return formatLeveledEnchantment(buildItem.enchantment);
      case 'step':
        return m('span.fw-bold', buildItem.stepId);
      default:
        throw Error();
    }
  },
};

const StepsList = {
  view: function () {
    return m(
      'div',
      {
        class: Model.buildPlan.size ? '' : 'invisible',
      },
      [
        m('h3', 'Steps'),
        m(
          'ol',
          Model.buildPlan
            .entrySeq()
            .map(([stepId, buildStep]) =>
              m('li', [
                m('span.fw-bold', stepId),
                ' = ',
                m(BuildItemView, { buildItem: buildStep.target }),
                ' + ',
                m(BuildItemView, { buildItem: buildStep.sac }),
                m('br'),
                `(${buildStep.levelCost} level${
                  buildStep.levelCost > 1 ? 's' : ''
                })`,
              ])
            )
            .toArray()
        ),
      ]
    );
  },
};

const View = {
  view: function () {
    return m('.row', [
      m('.col-lg-7.mb-3', [
        m('h3', 'Select item and enchantments'),
        m('.col-12.mb-3', [
          m('.form-floating', [
            m(BaseItemSelect),
            m('label', { for: 'baseItemSelect' }, 'Base item'),
          ]),
        ]),
        m('.col-12', [m('form', [m(EnchantmentsList)])]),
        m('.col-12', [
          m('.d-grid.gap-2.col-6.mx-auto', [
            m(
              'button.btn.btn-primary',
              {
                onclick: function (e: any) {
                  const choices = List(
                    Model.enchantmentChoices.filter(({ level }) => level > 0)
                  );
                  Model.buildPlan = build(choices);
                },
              },
              'Calculate optimal steps'
            ),
          ]),
        ]),
      ]),
      m('.col-lg-5', [m(StepsList)]),
    ]);
  },
};

m.mount(document.getElementById('viewMount')!, View);
