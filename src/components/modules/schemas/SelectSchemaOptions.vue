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
            v-model="option.name"
            :disabled="disabled"
            rules="required"
            :label="$t('common.form.name')"
          />
          <app-input
            v-model="option.price"
            :disabled="disabled"
            type="number"
            :label="$t('form.price')"
          />
          <Autocomplete
            v-model="options[i].items"
            :disabled="disabled"
            class="input"
            type="products"
            :label="$t('form.items')"
          />
          <SwitchInput v-model="option.disabled" :disabled="disabled">
            <template #title>{{ $t('disabled') }}</template>
          </SwitchInput>
          <a-radio :disabled="disabled" :value="i" class="radio-option-default">
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

<i18n>
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
import Vue from 'vue'
import Draggable from 'vuedraggable'
import cloneDeep from 'lodash/cloneDeep'

import Zone from '@/components/layout/Zone.vue'
import Autocomplete from '@/components/Autocomplete.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'

import { SchemaOptionDto } from '@/interfaces/Schema'
import { CLEAR_OPTION } from '@/consts/schemaConsts'

export default Vue.extend({
  name: 'SelectSchemaOptions',
  components: {
    Zone,
    Autocomplete,
    SwitchInput,
    Draggable,
  },
  props: {
    defaultOption: {
      type: [Number, String],
      required: true,
    },
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<SchemaOptionDto[]>,
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
  methods: {
    setDefault(v: number) {
      this.$emit('setDefault', v)
    },
    addOption() {
      this.options.push(cloneDeep(CLEAR_OPTION))
    },
    removeOption(index: number) {
      this.options = this.options.filter((_, i) => i !== index)
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
    align-items: center;
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

    ::v-deep .app-input {
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

      &::v-deep .icon-button__icon {
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
    color: #bbbbbb;

    &--disabled {
      color: #dddddd;
      cursor: not-allowed;
    }
  }
}
</style>
