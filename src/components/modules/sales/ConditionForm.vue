<template>
  <div class="condition-form">
    {{ condition }}

    <icon-button type="danger" size="small" @click="removeSelf()">
      <template #icon>
        <i class="bx bx-trash"></i>
      </template>
    </icon-button>
  </div>
</template>

<i18n>
{
  "en": {
  },
  "pl": {
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { DiscountConditionDto, DiscountConditionType } from '@/interfaces/SaleCondition'

export default Vue.extend({
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<DiscountConditionDto>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    condition: {
      get(): DiscountConditionDto {
        return this.value
      },
      set(v: DiscountConditionDto) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    removeSelf() {
      this.$emit('remove')
    },
  },
})
</script>

<style lang="scss" scoped>
.condition-form {
  border: solid 1px red;
}
</style>
