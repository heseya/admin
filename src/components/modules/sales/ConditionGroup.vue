<template>
  <div class="condition-group">
    <div class="condition-group__header">
      <icon-button :disabled="disabled" size="small" @click="addCondition()">
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addCondition') }}
      </icon-button>
      <icon-button
        :disabled="disabled || !deletable"
        type="danger"
        size="small"
        @click="removeSelf()"
      >
        <template #icon>
          <i class="bx bx-trash"></i>
        </template>
        {{ $t('removeGroup') }}
      </icon-button>
    </div>

    <empty v-if="group.conditions.length === 0" small> {{ $t('empty') }} </empty>

    <div class="condition-group__content">
      <ConditionForm
        v-for="(condition, i) in group.conditions"
        :key="i"
        :value="getTypedCondition(i)"
        :number="i + 1"
        :disabled="disabled || condition.forced"
        @input="setTypedCondition($event.target.value, i)"
        @remove="removeCondition(i)"
      />
    </div>

    <ValidationProvider v-slot="{ errors }" class="metadata-form__error" rules="block-if-error">
      <input :value="group.conditions.length === 0" name="is-duplicated-error" type="hidden" />
      <a-alert v-if="errors.length" type="error" show-icon :message="$t('errorTitle')" />
    </ValidationProvider>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "addCondition": "Add condition",
    "removeGroup": "Remove conditions group",
    "empty": "No conditions in the group",
    "errorTitle": "Every group needs to have at least one condition"
  },
  "pl": {
    "addCondition": "Dodaj warunek",
    "removeGroup": "Usuń grupę warunków",
    "empty": "Brak warunków rabatowych w grupie",
    "errorTitle": "Każda grupa musi zawierać co najmniej jeden warunek"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationProvider } from 'vee-validate'
import { DiscountConditionGroup, DiscountConditionType } from '@heseya/store-core'

import Empty from '@/components/layout/Empty.vue'
import ConditionForm from './ConditionForm.vue'

import { EMPTY_PRODUCT_IN_FORM } from '@/consts/salesConditionsForms'
import { InnerConditionGroup } from '@/interfaces/SalesAndCoupons'
import { DiscountConditionDto } from '../../../../../sdk-core/src'

export default defineComponent({
  components: { Empty, ConditionForm, ValidationProvider },
  props: {
    value: { type: Object as PropType<InnerConditionGroup>, required: true },
    disabled: { type: Boolean, default: false },
    deletable: { type: Boolean, default: true },
  },
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    group: {
      get(): InnerConditionGroup {
        return this.value
      },
      set(v: InnerConditionGroup) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    addCondition() {
      // @ts-ignore TODO: fix types
      this.group.conditions = [...this.group.conditions, cloneDeep(EMPTY_PRODUCT_IN_FORM)]
    },
    removeCondition(i: number) {
      this.group.conditions = this.group.conditions.filter((_, index) => index !== i)
    },
    removeSelf() {
      this.$emit('remove')
    },
    getTypedCondition(index: number): DiscountConditionDto {
      return this.group.conditions[index] as DiscountConditionDto
    },
    setTypedCondition(value: DiscountConditionGroup['conditions'][number], index: number) {
      this.group.conditions[index] = value
    },
  },
})
</script>

<style lang="scss" scoped>
.condition-group {
  background-color: var(--background-color-500);
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
    grid-template-columns: 1fr;
    grid-gap: 8px;
    margin-top: 8px;

    @media ($viewport-5) {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
