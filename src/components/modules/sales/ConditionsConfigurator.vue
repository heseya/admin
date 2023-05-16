<template>
  <fieldset class="condition-groups-configurator">
    <div class="condition-groups-configurator__header">
      <legend class="condition-groups-configurator__title">
        {{ $t('title') }}
        <info-tooltip>{{ $t('titleTooltip') }}</info-tooltip>
      </legend>

      <icon-button @click="addConditionGroup()">
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addGroup') }}
      </icon-button>
    </div>

    <empty v-if="groups.length === 0"> {{ $t('empty') }} </empty>

    <div class="condition-groups-configurator__groups">
      <condition-group
        v-for="(group, i) in groups"
        :key="i"
        v-model="groups[i]"
        :disabled="disabled"
        :deletable="isDeletable"
        @remove="removeConditionGroup(i)"
      />
    </div>
  </fieldset>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Discount conditions",
    "titleTooltip": "Promotion conditions are assigned to groups. If there are no groups, the discount is always calculated. For a discount to be applied, within a single condition group, all conditions must be met. If there is more than one group, the discount will be calculated when any of the groups have conditions met.",
    "addGroup": "Add condition group",
    "empty": "No condition groups, discount can always be applied"
  },
  "pl": {
    "title": "Warunki rabatu",
    "titleTooltip": "Warunki promocji są przypisane do grup. Jeśli nie ma żadnych grup, rabat jest zawsze naliczany. Aby rabat został naliczony, w ramach jednej grupy warunków wszystkie warunki muszą być spełnione. Jeśli istnieje więcej niż jedna grupa, to rabat zostanie naliczony gdy dowolna z grup będzie miała spełnione warunki.",
    "addGroup": "Dodaj grupę warunków",
    "empty": "Brak warunków rabatowych, rabat zawsze będzie mógł być naliczony"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { DiscountCondition, DiscountConditionType } from '@heseya/store-core'

import Empty from '@/components/layout/Empty.vue'
import ConditionGroup from './ConditionGroup.vue'

import { InnerConditionGroup } from '@/interfaces/SalesAndCoupons'

import { EMPTY_ORDER_VALUE_FORM } from '@/consts/salesConditionsForms'

export default Vue.extend({
  components: { Empty, ConditionGroup },
  props: {
    value: { type: Array, required: true } as Vue.PropOptions<InnerConditionGroup[]>,
    disabled: { type: Boolean, default: false },
    forcedCondition: { type: Object, default: null } as Vue.PropOptions<DiscountCondition | null>,
  },
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    groups: {
      get(): InnerConditionGroup[] {
        return this.value
      },
      set(v: InnerConditionGroup[]) {
        this.$emit('input', v)
      },
    },

    isDeletable(): boolean {
      if (this.forcedCondition) return this.groups.length > 1
      return true
    },
  },

  watch: {
    forcedCondition: {
      immediate: true,
      handler() {
        this.handleForcedConditions()
      },
    },

    groups() {
      this.handleForcedConditions()
    },
  },

  methods: {
    isSameCondition(
      conditionA: Omit<DiscountCondition, 'id'> | null,
      conditionB: Omit<DiscountCondition, 'id'> | null,
    ): boolean {
      if (!conditionA || !conditionB) return false
      // @ts-ignore Dirty hack to make it work
      return Object.keys(conditionA).every((key: keyof object) => {
        if (key === 'id' || key === 'forced') return true
        if (Array.isArray(conditionA[key])) {
          return isEqual(
            (conditionA[key] as { id: string[] }[]).map((o) => o.id),
            (conditionB[key] as { id: string[] }[]).map((o) => o.id),
          )
        }
        return isEqual(conditionA[key], conditionB[key])
      })
    },

    handleForcedConditions() {
      if (!this.forcedCondition) return

      // If there is no group, create one and add forced condition to it
      if (this.groups.length === 0) {
        this.addConditionGroup()
      } else {
        // If every group contains forced condition with 'forced' flag, do nothing
        if (
          this.groups.every((group) =>
            group.conditions.some(
              (condition) =>
                this.isSameCondition(condition, this.forcedCondition) && condition.forced,
            ),
          )
        )
          return

        // For each of group check if it already contains forced condition, if not add it, if it has, add the forced flag to it (backend does not return it)
        this.groups.forEach((group) => {
          const forcedConditionIndex = group.conditions.findIndex((condition) =>
            this.isSameCondition(condition, this.forcedCondition),
          )

          if (forcedConditionIndex === -1) {
            group.conditions.push(cloneDeep({ ...this.forcedCondition!, forced: true }))
          } else {
            // Forces reactive update
            this.$set(group.conditions, forcedConditionIndex, {
              ...group.conditions[forcedConditionIndex],
              forced: true,
            })
          }
        })
      }
    },

    addConditionGroup() {
      const addedCondition = this.forcedCondition
        ? cloneDeep({ ...this.forcedCondition, forced: true })
        : cloneDeep(EMPTY_ORDER_VALUE_FORM)

      this.groups.push({
        conditions: [addedCondition],
      })
    },

    removeConditionGroup(i: number) {
      this.groups.splice(i, 1)
    },
  },
})
</script>

<style lang="scss" scoped>
.condition-groups-configurator {
  &__header {
    display: flex;
    align-items: center;

    .icon-button {
      white-space: nowrap;
    }
  }

  &__title {
    margin-bottom: 0;
  }
}
</style>
