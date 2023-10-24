<template>
  <list-item no-hover>
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
</template>

<i18n lang="json">
{
  "en": {
    "globalTooltip": "Global attribute is automatically given to all products",
    "copySuccess": "Attribute value has been copied!"
  },
  "pl": {
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
      type: Object as PropType<ProductAttribute>,
      required: true,
    },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isSelectorModalActive: false,
    globalAttributes: [] as Attribute[],
  }),
  computed: {
    attribute: {
      get(): ProductAttribute {
        return this.value || []
      },
      set(val: ProductAttribute) {
        this.$emit('input', val)
      },
    },
  },
  methods: {
    deleteAttribute(id: UUID) {
      this.$emit('deleteAttribute', id)
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
    width: 100%;
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
