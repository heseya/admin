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
      <AttributeItem
        v-for="attribute in attributes.slice(0, 4)"
        :key="attribute.id"
        :edited-lang="editedLang"
        :disabled="disabled"
        :value="attribute"
        @delete="deleteAttribute"
      />
      <LayoutAccordion
        v-if="attributes.length > 4"
        :title="$t('showMore', { x: attributes.length - 4 }).toString()"
        :expanded-title="$t('hideMore', { x: attributes.length - 4 }).toString()"
        white
      >
        <AttributeItem
          v-for="attribute in attributes.slice(4)"
          :key="attribute.id"
          :edited-lang="editedLang"
          :disabled="disabled"
          :value="attribute"
          @delete="deleteAttribute"
        />
      </LayoutAccordion>
    </list>

    <AttributeSelector
      v-model="isSelectorModalActive"
      :disabled="disabled"
      :existing="attributes"
      @add="addAttribute"
    />
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Product attributes",
    "addAttribute": "Add attribute",
    "noAttributesInProduct": "This product has no attributes yet",
    "showMore": "Show remaining {x} attributes",
    "hideMore": "Hide remaining {x} attributes"
  },
  "pl": {
    "title": "Atrybuty produktu",
    "addAttribute": "Dodaj atrybut",
    "noAttributesInProduct": "Ten produkt nie ma jeszcze żadnego atrybutu",
    "showMore": "Pokaż pozostałe atrybuty ({x})",
    "hideMore": "Ukryj pozostałe atrybuty ({x})"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Attribute, ProductAttribute } from '@heseya/store-core'

import Empty from '@/components/layout/Empty.vue'
import List from '@/components/layout/List.vue'
import AttributeSelector from '@/components/modules/attributes/Selector.vue'

import AttributeItem from '@/components/modules/attributes/configurator/Item.vue'

import { UUID } from '@/interfaces/UUID'
import LayoutAccordion from '@/components/layout/Accordion.vue'

export default defineComponent({
  components: {
    LayoutAccordion,
    Empty,
    List,
    AttributeSelector,
    AttributeItem,
  },
  props: {
    editedLang: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<ProductAttribute[]>,
      required: true,
    },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isSelectorModalActive: false,
    globalAttributes: [] as Attribute[],
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
  watch: {
    attributes() {
      this.loadGlobalAttributes()
    },
  },
  async created() {
    const attributes = await this.$accessor.attributes.fetch({ global: 1 })
    if (attributes) {
      this.globalAttributes = attributes.filter((a) => a.global)
      this.loadGlobalAttributes()
    }
  },
  methods: {
    loadGlobalAttributes() {
      const attributesToAdd = this.globalAttributes
        .filter((attr) => this.attributes.findIndex((a) => a.id === attr.id) === -1)
        .map((attr) => ({ ...attr, selected_options: [undefined as any] })) as ProductAttribute[]
      if (attributesToAdd.length > 0) this.attributes = [...this.attributes, ...attributesToAdd]
    },

    addAttribute(attribute: Attribute) {
      this.attributes = [
        ...this.attributes,
        { ...attribute, selected_options: [undefined as any] } as ProductAttribute,
      ]
      this.isSelectorModalActive = false
    },

    deleteAttribute(id: UUID) {
      const removedAttribute = this.attributes.find((a) => a.id === id)
      // When Global attribute is removed, value is removed, not the attribute itself
      if (removedAttribute?.global) {
        removedAttribute.selected_options = [undefined as any]
      } else {
        this.attributes = this.attributes.filter((a) => a.id !== id)
      }
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
    font-size: 1.1em;
    font-weight: 600;
  }

  &__actions {
    display: flex;
    width: 30px;
    margin-right: -12px;
    margin-left: 8px;
    flex-direction: column;

    @media ($viewport-10) {
      width: 60px;
      flex-direction: row;
    }
  }

  .global-tooltip {
    color: var(--gray-color-300);
    font-size: 1.3em;
  }

  &:deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header) {
    padding: 14px !important;
  }

  &:deep(.accordion__title) {
    font-weight: 300 !important;
    font-style: italic;
  }

  &:deep(.ant-collapse-content > .ant-collapse-content-box) {
    padding: 0 !important;
  }
}
</style>
