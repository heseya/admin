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
      <draggable v-model="options" :disabled="disabled" handle=".drag-icon">
        <div v-for="(option, i) in options" :key="i" class="select-schema-options__option">
          <i class="bx bx-grid-vertical drag-icon" :class="{ 'drag-icon--disabled': disabled }"></i>
          <validated-input
            :value="option.translations[editedLang]?.name || ''"
            :disabled="disabled"
            rules="required"
            :label="$t('common.form.name')"
            @input="setOptionName(i, $event)"
          />
          <CurrencyPriceForm
            v-model="option.prices"
            :disabled="option.default || disabled"
            :label="$t('form.price').toString()"
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
            class="radio-option-default"
            @click="onRadioClick(i)"
          >
            {{ $t('default') }}
          </a-radio>
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
      "price": "Cena"
    }
  },
  "en": {
    "title": "Select options",
    "disabled": "Disabled",
    "default": "Default",
    "form": {
      "items": "Items from warehouse",
      "price": "Price"
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
      this.setDefault(this.defaultOption === index ? null : index)
    },
    setOptionName(index: number, name: string) {
      if (!this.options[index].translations[this.editedLang])
        this.options[index].translations = {
          [this.editedLang]: { ...CLEAR_SCHEMA_OPTION_TRANSLATION },
        }

      this.options[index].translations[this.editedLang].name = name
    },
  },
})
</script>

<style lang="scss" scoped>
.select-schema-options {
  &__content {
    width: 100%;
  }

  &__option {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 20px 1fr 1fr 1fr;
    grid-template-areas:
      'drag name name name'
      '. price price price'
      '. items items items'
      '. onoff radio radio'
      '. delete delete delete';
    align-items: start;
    justify-items: center;
    margin-bottom: 8px;

    @media ($viewport-6) {
      grid-template-areas:
        'drag name name name'
        '. price price price'
        '. items items items'
        '. onoff radio delete';
    }

    @media ($viewport-7) {
      grid-template-areas:
        'drag name price items'
        '. onoff radio delete';
    }

    :deep(.app-input) {
      margin-bottom: 0;
    }

    > * {
      width: 100%;
    }

    .ant-radio-wrapper {
      grid-area: radio;
      display: flex;
      align-items: center;
      flex-direction: column-reverse;
      font-size: 0.8em;

      &.radio-option-default {
        flex-direction: row;
        justify-content: center;
        margin: 0;
      }
    }

    .drag-icon {
      grid-area: drag;
    }

    .input-wrapper {
      grid-area: name;
    }

    .app-input {
      grid-area: price;
    }

    .autocomplete {
      grid-area: items;
    }

    .switch-input {
      grid-area: onoff;
    }

    .icon-button {
      grid-area: delete;

      @media ($viewport-7) {
        width: fit-content;
        justify-self: end;
      }

      &:deep(.icon-button__icon) {
        @media ($max-viewport-7) {
          width: 100%;
          border-radius: 4px;
        }
      }
    }

    .ant-radio-wrapper.radio-option-default,
    .switch-input {
      @media ($viewport-7) {
        justify-content: flex-start;
      }
    }
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
</style>
