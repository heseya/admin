<template>
  <div class="attributes-configurator">
    <div class="attributes-configurator__header">
      <div class="attributes-configurator__title">{{ $t('title') }}</div>
      <icon-button v-if="!disabled" @click="isModalActive = true">
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addAttribute') }}
      </icon-button>
    </div>

    <empty v-if="attributes.length === 0">{{ $t('noAttributesInProduct') }}</empty>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Attributes",
    "addAttribute": "Add attribute to product",
    "noAttributesInProduct": "This product has no attributes yet"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ProductAttribute } from '@/interfaces/Attribute'

import Empty from '@/components/layout/Empty.vue'

export default Vue.extend({
  components: { Empty },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ProductAttribute[]>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    attributes: {
      get(): ProductAttribute[] {
        return this.value || []
      },
      set(val: ProductAttribute[]) {
        this.$emit('input', val)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.attributes-configurator {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 1.3em;
    font-weight: 600;
  }
}
</style>
