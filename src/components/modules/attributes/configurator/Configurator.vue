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
          <a-tooltip>
            <div class="product-attribute__title">
              <span>{{ attribute.name }}</span>
              <info-tooltip v-if="attribute.global" class="global-tooltip" icon="bx bx-globe">
                {{ $t('globalTooltip') }}
              </info-tooltip>
            </div>
            <template v-if="attribute.description" #title> {{ attribute.description }}</template>
          </a-tooltip>

          <div class="product-attribute__content">
            <component
              :is="getInputComponent(attribute.type)"
              v-model="attribute.selected_options"
              :attribute="attribute"
              :type="attribute.type"
              :edited-lang="editedLang"
            />
          </div>
        </div>

        <template #action>
          <div class="attributes-configurator__actions">
            <icon-button size="small" @click="copyAttribute(attribute)">
              <template #icon>
                <i class="bx bx-copy"></i>
              </template>
            </icon-button>

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

<i18n lang="json">
{
  "en": {
    "title": "Product attributes",
    "addAttribute": "Add attribute",
    "noAttributesInProduct": "This product has no attributes yet",
    "globalTooltip": "Global attribute is automatically given to all products",
    "copySuccess": "Attribute value has been copied!"
  },
  "pl": {
    "title": "Atrybuty produktu",
    "addAttribute": "Dodaj cechę",
    "noAttributesInProduct": "Ten produkt nie ma jeszcze żadnego atrybutu",
    "globalTooltip": "Globalna atrybut jest automatycznie dodawana do wszystkich produktów",
    "copySuccess": "Wartość atrybutów została skopiowana!"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { AttributeType, Attribute, ProductAttribute } from '@heseya/store-core'

import Empty from '@/components/layout/Empty.vue'
import List from '@/components/layout/List.vue'
import ListItem from '@/components/layout/ListItem.vue'
import AttributeSelector from '@/components/modules/attributes/Selector.vue'

import DateAndNumberTypeInput from '@/components/modules/attributes/configurator/DateAndNumberTypeInput.vue'
import SelectTypeInput from '@/components/modules/attributes/configurator/SelectTypeInput.vue'

import { UUID } from '@/interfaces/UUID'

export default defineComponent({
  components: {
    Empty,
    List,
    ListItem,
    AttributeSelector,
    DateAndNumberTypeInput,
    SelectTypeInput,
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
      this.attributes = this.attributes.filter((a) => a.id !== id)
    },

    async copyAttribute(attribute: ProductAttribute) {
      const stringToCopy = attribute.selected_options
        .map((v) => v.value_date || v.value_number || v.name)
        .join(', ')

      await navigator.clipboard.writeText(stringToCopy)
      this.$toast.info(this.$t('copySuccess') as string)
    },

    getInputComponent(type: AttributeType): string {
      switch (type) {
        case AttributeType.Number:
        case AttributeType.Date:
          return 'DateAndNumberTypeInput'
        case AttributeType.SingleOption:
        case AttributeType.MultiChoiceOption:
          return 'SelectTypeInput'
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
}

.product-attribute {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;

  @media ($viewport-6) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    display: flex;
    align-items: center;

    > *:not(:last-child) {
      margin-right: 4px;
    }
  }

  &__content {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    font-weight: 400;
  }
}
</style>
