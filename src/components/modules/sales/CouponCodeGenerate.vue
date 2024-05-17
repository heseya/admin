<template>
  <icon-button class="coupon-generate-btn" :disabled="disabled" @click="generateCoupon">
    <template #icon>
      <i class="bx bx-barcode"></i>
    </template>
    {{ $t('generateText') }}
  </icon-button>
</template>

<i18n lang="json">
{
  "en": {
    "generateText": "Generate code"
  },
  "pl": {
    "generateText": "Generuj kod"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['generate'],

  methods: {
    generateCoupon() {
      const CODE_LENGTH = 10

      const code = Array.from({ length: CODE_LENGTH }, () => Math.random().toString(36)[2])
        .join('')
        .toUpperCase()
      this.$emit('generate', code)
    },
  },
})
</script>

<style scoped lang="scss">
.coupon-generate-btn {
  flex-shrink: 0;
  align-self: center;
  width: 140px;
}
</style>
