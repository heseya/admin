<template>
  <div class="condition-group">
    <div class="condition-group__header">
      <icon-button size="small" @click="addCondition()">
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addCondition') }}
      </icon-button>
      <icon-button type="danger" size="small" @click="removeSelf()">
        <template #icon>
          <i class="bx bx-trash"></i>
        </template>
        {{ $t('removeGroup') }}
      </icon-button>
    </div>

    <empty v-if="group.conditions.length === 0" small> {{ $t('empty') }} </empty>

    <div class="condition-group__content">
      <condition-form
        v-for="(condition, i) in group.conditions"
        :key="i"
        v-model="group.conditions[i]"
        :disabled="disabled"
        @remove="removeCondition(i)"
      />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "addCondition": "Add condition",
    "removeGroup": "Remove group",
    "empty": "No conditions in the group"
  },
  "pl": {
    "addCondition": "Dodaj warunek",
    "removeGroup": "Usuń grupę",
    "empty": "Brak warunków rabatowych w grupie"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'

import { DiscountConditionGroupDto, DiscountConditionType } from '@/interfaces/SaleCondition'
import Empty from '@/components/layout/Empty.vue'
import ConditionForm from './ConditionForm.vue'

import { EMPTY_ORDER_VALUE_FORM } from '@/consts/salesConditionsForms'

export default Vue.extend({
  components: { Empty, ConditionForm },
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<DiscountConditionGroupDto>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    group: {
      get(): DiscountConditionGroupDto {
        return this.value
      },
      set(v: DiscountConditionGroupDto) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    addCondition() {
      this.group.conditions = [...this.group.conditions, cloneDeep(EMPTY_ORDER_VALUE_FORM)]
    },
    removeCondition(i: number) {
      this.group.conditions = this.group.conditions.filter((_, index) => index !== i)
    },
    removeSelf() {
      this.$emit('remove')
    },
  },
})
</script>

<style lang="scss" scoped>
.condition-group {
  border: dashed 1px $background-color-700;
  border-radius: 4px;
  padding: 8px;
  transition: 0.3s;
  margin-top: 24px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .icon-button {
      white-space: nowrap;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 8px;
  }
}
</style>
