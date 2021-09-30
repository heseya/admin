<template>
  <validation-observer v-slot="{ handleSubmit }" class="webhook-form">
    <validated-input v-model="form.name" :disabled="disabled" name="name" label="Nazwa" />
    <validated-input
      v-model="form.url"
      :disabled="disabled"
      name="url"
      rules="required"
      label="Link"
    />

    <div class="webhook-form__switches">
      <switch-input v-model="form.with_issuer" horizontal :disabled="disabled">
        <template #title>
          Z podmiotem
          <a-tooltip>
            <small slot="title">
              Jeśli zaznaczone, żądanie będzie zawierać informacje o użytkowniku (lub aplikacji),
              który spowodował daną akcję. Np. zawarta będzie informacja o osobie która zedytowała
              produkt.
            </small>
            <i class="bx bxs-info-circle"></i>
          </a-tooltip>
        </template>
      </switch-input>

      <switch-input v-model="form.with_hidden" horizontal :disabled="disabled">
        <template #title>
          Z ukrytymi
          <a-tooltip>
            <small slot="title">
              Jeśli zaznaczone, żądanie będzie wykonywane również dla obiektów, które są w systemie
              ukryte. Np. edycja ukrytego produktu.
            </small>
            <i class="bx bxs-info-circle"></i>
          </a-tooltip>
        </template>
      </switch-input>
    </div>

    <validated-input
      v-model="form.secret"
      :disabled="disabled"
      name="secret"
      label="Sekretny token"
    />
    <small>
      Użyj tego tokena do sprawdzenia poprawności otrzymanego payloadu. Jest on wysyłany wraz z
      żądaniem w nagłówku HTTP <code>X-Heseya-Token</code>.
    </small>

    <br />
    <app-button :disabled="disabled" @click.stop="handleSubmit(submit)"> Zapisz </app-button>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationObserver } from 'vee-validate'

import { WebHookDto } from '@/interfaces/Webhook'

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<WebHookDto>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): WebHookDto {
        return this.value
      },
      set(discount: WebHookDto) {
        this.$emit('input', discount)
      },
    },
  },
  methods: {
    submit() {
      this.$emit('submit', this.form)
    },
  },
})
</script>

<style lang="scss">
.webhook-form {
  small {
    margin-top: -4px;
    display: block;
  }

  &__switches {
    display: flex;
    justify-content: space-around;
  }

  .bx {
    color: $primary-color-300;
  }
}
</style>
