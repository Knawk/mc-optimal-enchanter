import { List, Map, Range } from 'immutable';
import m from 'mithril';
import type { Vnode } from 'mithril';

import {
  Enchantment,
  ENCHANTMENT_DATA,
  LeveledEnchantment,
  findConflicts,
  formatEnchantment,
  formatEnchantmentLevel,
  formatLeveledEnchantment,
} from './enchantments';
import { build, BuildPlan, BuildStep, BuildItem } from './build';
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

interface EnchantmentChoice extends LeveledEnchantment {
  isCompatible: boolean;
}

interface ModelProps {
  baseItem: BaseItem;
  enchantmentChoices: EnchantmentChoice[];
  conflicts: List<List<Enchantment>>;
  buildPlan: BuildPlan;
}

const NO_BUILD_PLAN: BuildPlan = Map();

const Model: ModelProps = {
  baseItem: BaseItem.Pickaxe,
  enchantmentChoices: ENCHANTMENT_DATA.sortBy((data) => data.name)
    .entrySeq()
    .map(([enchantment, data]) => ({
      enchantment,
      level: 0,
      isCompatible: false,
    }))
    .toArray(),
  conflicts: List(),
  buildPlan: NO_BUILD_PLAN,
};

function getSelectedEnchantmentChoices(): Iterable<EnchantmentChoice> {
  return Model.enchantmentChoices.filter(
    ({ level, isCompatible }) => isCompatible && level > 0
  );
}

function updateCompatibleEnchantments() {
  const compatibleEnchantments = getCompatibleEnchantments(Model.baseItem);
  for (let choice of Model.enchantmentChoices) {
    choice.isCompatible = compatibleEnchantments.has(choice.enchantment);
  }
}

function updateConflicts() {
  Model.conflicts = findConflicts(
    getSelectedEnchantmentChoices().map(({ enchantment }) => enchantment)
  );
}

const BaseItemSelect = {
  oninit: function () {
    updateCompatibleEnchantments();
  },
  view: function () {
    return m(
      'select.form-select',
      {
        id: 'baseItemSelect',
        onchange: function (e: any) {
          Model.baseItem = e.target.value;
          updateCompatibleEnchantments();
          updateConflicts();
          Model.buildPlan = NO_BUILD_PLAN;
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
    return m(
      '.row',
      Model.enchantmentChoices.map((choice) => {
        const data = ENCHANTMENT_DATA.get(choice.enchantment)!;
        const selectId = `enchantmentSelect_${choice.enchantment}`;
        return m(
          '.col-sm-6.enchantmentContainer',
          {
            class: choice.isCompatible ? '' : 'disabled',
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
                    updateConflicts();
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

/**
 * Precondition: conflict must contain at least two elements
 */
function formatConflict(conflict: List<Enchantment>): string {
  const names = conflict.map((name) => formatEnchantment(name));
  const init = names.butLast().join(', ');
  const oxford = names.size > 2 ? ',' : '';
  const last = names.last();
  return `${init}${oxford} and ${last} are incompatible.`;
}

const ConflictsWarning = {
  view: function () {
    return m(
      '.alert.alert-danger',
      {
        class: Model.conflicts.size ? '' : 'd-none',
      },
      [
        'These enchantments cannot be combined.',
        m(
          'ul.mb-0',
          Model.conflicts
            .map((conflict) => m('li', formatConflict(conflict)))
            .toArray()
        ),
      ]
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
        m('form', [
          m('h3', 'Select item and enchantments'),
          m('.col-12.mb-3', [
            m('.form-floating', [
              m(BaseItemSelect),
              m('label', { for: 'baseItemSelect' }, 'Base item'),
            ]),
          ]),
          m('.col-12', [m('form', [m(EnchantmentsList)])]),
          m('.col-12.mb-3', [
            m('.d-grid.gap-2.col-6.mx-auto', [
              m(
                'button.btn.btn-primary',
                {
                  type: 'button',
                  disabled: Model.conflicts.size > 0,
                  onclick: function (e: any) {
                    const choices = List(getSelectedEnchantmentChoices());
                    Model.buildPlan = build(choices);
                  },
                },
                'Calculate optimal steps'
              ),
            ]),
          ]),
          m('.col-12', [m(ConflictsWarning)]),
        ]),
      ]),
      m('.col-lg-5', [m(StepsList)]),
    ]);
  },
};

m.mount(document.getElementById('viewMount')!, View);
