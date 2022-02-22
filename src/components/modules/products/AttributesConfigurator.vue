<template>
  <div class="attributes-configurator">
    <div class="attributes-configurator__header">
      <div class="attributes-configurator__title">{{ $t('title') }}</div>
      <icon-button v-if="!disabled" @click="isSelectorModalActive = true">
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addAttribute') }}
      </icon-button>
    </div>

    <empty v-if="attributes.length === 0">{{ $t('noAttributesInProduct') }}</empty>

    <list v-else class="attributes-configurator__list">
      <list-item v-for="attribute in attributes" :key="attribute.id" no-hover>
        {{ attribute.name }}
      </list-item>
    </list>

    <AttributeSelector
      v-model="isSelectorModalActive"
      :disabled="disabled"
      :existing="attributes"
      @add="addAttribute"
    />
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
import List from '@/components/layout/List.vue'
import ListItem from '@/components/layout/ListItem.vue'
import AttributeSelector from '@/components/modules/attributes/Selector.vue'

export default Vue.extend({
  components: { Empty, List, ListItem, AttributeSelector },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ProductAttribute[]>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isSelectorModalActive: false,
  }),
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
  methods: {
    addAttribute(attribute: ProductAttribute) {
      this.attributes.push(attribute)
      this.isSelectorModalActive = false
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
