<template>
  <Zone class="select-schema-options">
    <template #title>
      Opcje do wyboru
      <icon-button :disabled="disabled" size="small" reversed @click="addOption">
        <i slot="icon" class="bx bx-plus"></i> Dodaj
      </icon-button>
    </template>

    <draggable v-model="options" :disabled="disabled" handle=".drag-icon">
      <div v-for="(option, i) in options" :key="i" class="select-schema-options__option">
        <i class="bx bx-grid-vertical drag-icon" :class="{ 'drag-icon--disabled': disabled }"></i>
        <validated-input
          v-model="option.name"
          :disabled="disabled"
          rules="required"
          label="Nazwa"
        />
        <app-input v-model="option.price" :disabled="disabled" type="number" label="Cena" />
        <Autocomplete
          v-model="options[i].items"
          :disabled="disabled"
          class="input"
          type="products"
          label="Przedmioty z magazynu"
        />
        <SwitchInput v-model="option.disabled" :disabled="disabled">
          <template #title>Disabled</template>
        </SwitchInput>
        <vs-radio :disabled="disabled" :value="defaultOption" :val="i" dark @input="setDefault">
          Domyślny
        </vs-radio>
        <icon-button
          size="small"
          type="danger"
          :disabled="options.length === 1 || disabled"
          @click="removeOption(i)"
        >
          <i slot="icon" class="bx bx-trash"></i>
        </icon-button>
      </div>
    </draggable>
    <icon-button :disabled="disabled" size="small" reversed @click="addOption">
      <i slot="icon" class="bx bx-plus"></i> Dodaj
    </icon-button>
  </Zone>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'
import cloneDeep from 'lodash/cloneDeep'

import Zone from '@/components/layout/Zone.vue'
import Autocomplete from '@/components/Autocomplete.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'

import { SchemaOption } from '@/interfaces/Schema'

const CLEAR_OPTION: SchemaOption = {
  id: '',
  name: '',
  default: false,
  disabled: false,
  price: 0,
  items: [],
}

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
    } as Vue.PropOptions<SchemaOption[]>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    options: {
      get(): SchemaOption[] {
        return this.value
      },
      set(v: SchemaOption[]) {
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
  &__option {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 20px 1fr 100px 1fr 64px 64px 64px;
    align-items: center;
    justify-items: center;

    > * {
      width: 100%;
    }

    .vs-radio-content {
      flex-direction: column;
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
