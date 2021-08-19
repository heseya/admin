<template>
  <Zone class="select-schema-options">
    <template #title>
      Opcje do wyboru
      <vs-button :disabled="disabled" size="small" transparent @click.stop="addOption">
        <i class="bx bx-plus"></i> Dodaj
      </vs-button>
    </template>

    <div class="select-schema-options__option" v-for="(option, i) in options" :key="i">
      <validation-provider class="input" v-slot="{ errors }" rules="required">
        <vs-input :disabled="disabled" v-model="option.name" label="Nazwa">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
      <vs-input :disabled="disabled" v-model="option.price" type="number" label="Cena"></vs-input>
      <Autocomplete
        :disabled="disabled"
        class="input"
        type="products"
        label="Przedmioty z magazynu"
        v-model="options[i].items"
      />
      <SwitchInput :disabled="disabled" v-model="option.disabled">
        <template #title>Disabled</template>
      </SwitchInput>
      <vs-radio :disabled="disabled" :value="defaultOption" @input="setDefault" :val="i" dark>
        Domyślny
      </vs-radio>
      <vs-button
        size="small"
        danger
        icon
        @click.stop="removeOption(i)"
        :disabled="options.length === 1 || disabled"
      >
        <i class="bx bx-trash"></i>
      </vs-button>
    </div>
    <vs-button size="small" transparent @click.stop="addOption" :disabled="disabled">
      <i class="bx bx-plus"></i> Dodaj
    </vs-button>
  </Zone>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'
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
    ValidationProvider,
    Zone,
    Autocomplete,
    SwitchInput,
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
    grid-template-columns: 1fr 100px 1fr 64px 64px 64px;
    align-items: center;
    justify-items: center;

    .input {
      width: 100%;
    }

    .vs-radio-content {
      flex-direction: column;
    }
  }
}
</style>
