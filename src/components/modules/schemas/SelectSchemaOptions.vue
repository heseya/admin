<template>
  <Zone class="select-schema-options">
    <template #title>
      {{ $t('title') }}
      <icon-button :disabled="disabled" size="small" reversed @click="addOption">
        <template #icon> <i class="bx bx-plus"></i> </template> {{ $t('common.add') }}
      </icon-button>
    </template>
    <a-radio-group
      :value="defaultOption"
      class="select-schema-options__content"
      @input="setDefault"
    >
      <draggable :value="options" :disabled="disabled" handle=".drag-icon" @input="setOptionsOrder">
        <div v-for="(option, i) in options" :key="i" class="schema-option">
          <i class="bx bx-grid-vertical drag-icon" :class="{ 'drag-icon--disabled': disabled }"></i>
          <div class="schema-option__content">
            <div class="schema-option__row">
              <validated-input
                :value="option.translations[editedLang]?.name || ''"
                :disabled="disabled"
                rules="required"
                :label="$t('common.form.name')"
                @input="setOptionName(i, $event)"
              />
              <Autocomplete
                v-model="options[i].items"
                :disabled="disabled"
                class="input"
                type="products"
                :label="$t('form.items').toString()"
              />
              <a-radio
                :disabled="disabled"
                :value="i"
                name="radio-option-default"
                @click="setDefault(i)"
              >
                {{ $t('default') }}
              </a-radio>
            </div>
            <div>
              <h5>{{ $t('form.prices') }}</h5>
              <CurrencyPriceForm
                v-model="option.prices"
                class="schema-option__prices"
                :disabled="option.default || disabled"
              />
            </div>
          </div>
          <icon-button
            size="small"
            type="danger"
            :disabled="options.length === 1 || disabled"
            @click="removeOption(i)"
          >
            <template #icon>
              <i class="bx bx-trash"></i>
            </template>
          </icon-button>
        </div>
      </draggable>
    </a-radio-group>
    <icon-button :disabled="disabled" size="small" reversed @click="addOption">
      <template #icon> <i class="bx bx-plus"></i> </template> {{ $t('common.add') }}
    </icon-button>
  </Zone>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Opcje do wyboru",
    "disabled": "Wyłączony",
    "default": "Domyślny",
    "form": {
      "items": "Przedmioty z magazynu",
      "prices": "Ceny"
    }
  },
  "en": {
    "title": "Select options",
    "disabled": "Disabled",
    "default": "Default",
    "form": {
      "items": "Items from warehouse",
      "prices": "Prices"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Draggable from 'vuedraggable'
import cloneDeep from 'lodash/cloneDeep'
import { SchemaOptionDto } from '@heseya/store-core'

import Zone from '@/components/layout/Zone.vue'
import Autocomplete from '@/components/Autocomplete.vue'
import CurrencyPriceForm from '@/components/CurrencyPriceForm.vue'

import { CLEAR_SCHEMA_OPTION, CLEAR_SCHEMA_OPTION_TRANSLATION } from '@/consts/schemaConsts'

export default defineComponent({
  name: 'SelectSchemaOptions',
  components: {
    Zone,
    Autocomplete,
    Draggable,
    CurrencyPriceForm,
  },
  props: {
    defaultOption: {
      type: [Number, String],
      default: null,
    },
    editedLang: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<SchemaOptionDto[]>,
      required: true,
    },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    options: {
      get(): SchemaOptionDto[] {
        return this.value
      },
      set(v: SchemaOptionDto[]) {
        this.$emit('input', v)
      },
    },
  },

  watch: {
    options: {
      handler(nVal: SchemaOptionDto[], oVal: SchemaOptionDto[]) {
        for (let i = 0; i < nVal.length; i++) {
          if (nVal[i].default !== oVal[i].default && nVal[i].default === true) {
            nVal[i].prices = this.$accessor.config.currencies.map((c) => ({
              value: '0',
              currency: c.code,
            }))
          }
        }
      },
      deep: true,
    },
  },

  methods: {
    setDefault(v: number | null) {
      this.$emit('set-default', v)
    },
    addOption() {
      this.options.push(
        cloneDeep({
          ...CLEAR_SCHEMA_OPTION,
          translations: { [this.editedLang]: { ...CLEAR_SCHEMA_OPTION_TRANSLATION } },
          prices: this.$accessor.config.currencies.map((c) => ({ value: '0', currency: c.code })),
        }),
      )
    },
    removeOption(index: number) {
      this.options = this.options.filter((_, i) => i !== index)
    },
    onRadioClick(index: number) {
      this.setDefault(index)
    },
    setOptionName(index: number, name: string) {
      if (!this.options[index].translations[this.editedLang])
        this.options[index].translations = {
          [this.editedLang]: { ...CLEAR_SCHEMA_OPTION_TRANSLATION },
        }

      this.options[index].translations[this.editedLang].name = name
    },

    setOptionsOrder(newOptions: SchemaOptionDto[]) {
      const defaultIndex = newOptions.findIndex((o) => o.default)
      this.setDefault(defaultIndex)
      this.options = newOptions
    },
  },
})
</script>

<style lang="scss" scoped>
.select-schema-options {
  background-color: $background-color-500;
  border: none;
  padding: 16px;

  &__content {
    width: 100%;
    margin-bottom: 8px;
  }

  .drag-icon {
    cursor: move;
    color: var(--gray-color-400);

    &--disabled {
      color: var(--gray-color-300);
      cursor: not-allowed;
    }
  }
}

.schema-option {
  display: grid;
  grid-template-columns: 20px 1fr 24px;
  grid-gap: 8px;
  align-items: start;
  justify-items: center;
  background-color: #fff;
  border: solid 1px $background-color-700;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 8px;

  :deep(.app-input) {
    margin-bottom: 0;
  }

  &__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__row {
    width: 100%;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr;
    gap: 8px;

    @media ($viewport-4) {
      grid-template-columns: 1fr 0.5fr;
    }

    > *:first-child {
      @media ($viewport-4) {
        grid-column: span 2;
      }

      @media ($viewport-9) {
        grid-column: span 1;
      }
    }

    @media ($viewport-9) {
      grid-template-columns: 1fr 1fr 0.5fr;
    }

    > * {
      width: 100%;
    }
  }

  &__prices {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    @media ($viewport-4) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media ($viewport-9) {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
  }
}
</style>
