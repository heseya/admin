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
        <div class="product-attribute">
          <div class="product-attribute__title">
            <info-tooltip v-if="attribute.global" class="global-tooltip" icon="bx bx-globe-alt">
              {{ $t('globalTooltip') }}
            </info-tooltip>
            <span>{{ attribute.name }}</span>
            <info-tooltip v-if="attribute.description"> {{ attribute.description }}</info-tooltip>
          </div>

          <div class="product-attribute__content">
            <component
              :is="getInputComponent(attribute.type)"
              v-model="attribute.selected_options"
              :attribute="attribute"
              :type="attribute.type"
            />
          </div>
        </div>

        <template #action>
          <div class="attributes-configurator__delete-action">
            <icon-button
              v-if="!disabled && !attribute.global"
              size="small"
              type="danger"
              @click="deleteAttribute(attribute.id)"
            >
              <template #icon>
                <i class="bx bx-trash"></i>
              </template>
            </icon-button>
          </div>
        </template>
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
    "noAttributesInProduct": "This product has no attributes yet",
    "globalTooltip": "Global attribute is automatically given to all products"
  },
  "pl": {
    "title": "Cechy",
    "addAttribute": "Dodaj cechę do produktu",
    "noAttributesInProduct": "Ten produkt nie ma jeszcze żadnej cechy",
    "globalTooltip": "Globalna cecha jest automatycznie dodawana do wszystkich produktów"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Attribute, AttributeType, ProductAttribute } from '@/interfaces/Attribute'

import Empty from '@/components/layout/Empty.vue'
import List from '@/components/layout/List.vue'
import ListItem from '@/components/layout/ListItem.vue'
import AttributeSelector from '@/components/modules/attributes/Selector.vue'

import DateAndNumberTypeInput from '@/components/modules/attributes/configurator/DateAndNumberTypeInput.vue'
import SingleSelectTypeInput from '@/components/modules/attributes/configurator/SingleSelectTypeInput.vue'

import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  components: {
    Empty,
    List,
    ListItem,
    AttributeSelector,
    DateAndNumberTypeInput,
    SingleSelectTypeInput,
  },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ProductAttribute[]>,
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
        .map((attr) => ({ ...attr, selected_options: [undefined as any] }))
      if (attributesToAdd.length > 0) this.attributes = [...this.attributes, ...attributesToAdd]
    },

    addAttribute(attribute: Attribute) {
      this.attributes = [...this.attributes, { ...attribute, selected_options: [undefined as any] }]
      this.isSelectorModalActive = false
    },

    deleteAttribute(id: UUID) {
      this.attributes = this.attributes.filter((a) => a.id !== id)
    },

    getInputComponent(type: AttributeType): string {
      switch (type) {
        case AttributeType.Number:
        case AttributeType.Date:
          return 'DateAndNumberTypeInput'
        case AttributeType.SingleOption:
        case AttributeType.MultiChoiceOption: // TODO: dedicated component?
          return 'SingleSelectTypeInput'
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
    font-size: 1.3em;
    font-weight: 600;
  }

  &__delete-action {
    width: 30px;
    margin-right: -12px;
    margin-left: 8px;
  }

  .global-tooltip {
    color: $green-color-500;
    font-size: 1.3em;
  }
}

.product-attribute {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__title {
    display: flex;
    align-items: center;

    > *:not(:last-child) {
      margin-right: 4px;
    }
  }

  &__content {
    font-weight: 400;
  }
}
</style>
