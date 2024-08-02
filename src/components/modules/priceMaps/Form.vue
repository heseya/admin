<template>
  <ValidationObserver v-slot="{ handleSubmit }" class="price-map-form">
    <validated-input
      v-model="form.name"
      :disabled="disabled"
      name="name"
      rules="required"
      :label="$t('common.form.name').toString()"
    />

    <validated-input
      v-model="form.description"
      :disabled="disabled"
      name="description"
      rules="required"
      :label="$t('common.form.description').toString()"
    />

    <div class="price-map-form__row">
      <BooleanSelect
        v-model="formIsNet"
        :disabled="disabled"
        name="is_net"
        rules="required"
        :label="$t('common.form.type').toString()"
        :true-text="$t('common.net').toString()"
        :false-text="$t('common.gross').toString()"
        :add-all="false"
      />

      <app-select v-model="form.currency" :label="$t('common.currency').toString()" name="currency">
        <a-select-option
          v-for="currency in currencies"
          :key="currency.code"
          :value="currency.code"
          :label="currency.name"
        >
          <span class="currency-switch__option"> {{ currency.name }} </span>
        </a-select-option>
      </app-select>
    </div>

    <br />
    <app-button data-cy="submit-btn" :disabled="disabled" @click.stop="handleSubmit(onSubmit)">
      {{ $t('common.save') }}
    </app-button>
  </ValidationObserver>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Currency, PriceMapCreateDto } from '@heseya/store-core'

import BooleanSelect from '@/components/form/BooleanSelect.vue'

export default defineComponent({
  components: {
    ValidationObserver,
    BooleanSelect,
  },

  props: {
    value: {
      type: Object as PropType<PriceMapCreateDto>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['submit', 'input'],

  data: () => ({
    editedLang: '',
  }),

  computed: {
    currencies(): Currency[] {
      return this.$accessor.config.currencies
    },
    form: {
      get(): PriceMapCreateDto {
        return this.value
      },
      set(value: PriceMapCreateDto) {
        this.$emit('input', value)
      },
    },
    formIsNet: {
      get(): string {
        return this.form.is_net ? '1' : '0'
      },
      set(value: string) {
        this.form.is_net = value === '1'
      },
    },
  },

  methods: {
    onSubmit() {
      this.$emit('submit')
    },
  },
})
</script>

<style lang="scss" scoped>
.price-map-form {
  &__row {
    display: flex;
    gap: 8px;
    justify-content: stretch;

    & > * {
      flex: 1;
    }
  }

  &__switch {
    text-align: right;
    font-size: 0.8em;
    flex: 0;
  }
}
</style>
