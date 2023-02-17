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
        :disabled="disabled || group.forced"
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
import { DiscountConditionGroupDto, DiscountConditionType } from '@heseya/store-core'

import Empty from '@/components/layout/Empty.vue'
import ConditionGroup from './ConditionGroup.vue'

import { EMPTY_ORDER_VALUE_FORM } from '@/consts/salesConditionsForms'

type ConditionGroup = DiscountConditionGroupDto & { forced?: true }

export default Vue.extend({
  components: { Empty, ConditionGroup },
  props: {
    value: { type: Array, required: true } as Vue.PropOptions<ConditionGroup[]>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    groups: {
      get(): ConditionGroup[] {
        return this.value
      },
      set(v: ConditionGroup[]) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    addConditionGroup() {
      this.groups.push({
        conditions: [cloneDeep(EMPTY_ORDER_VALUE_FORM)],
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
