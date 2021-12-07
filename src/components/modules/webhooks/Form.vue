<template>
  <validation-observer v-slot="{ handleSubmit, errors }" class="webhook-form">
    <validated-input v-model="form.name" :disabled="disabled" name="name" label="Nazwa" />
    <validated-input
      v-model="form.url"
      :disabled="disabled"
      name="url"
      rules="required|url"
      label="Link"
    />

    <a-alert
      v-if="!hasHttps && form.url && errors.url && errors.url.length === 0"
      type="warning"
      show-icon
      message="Link docelowy webhooka nie posiada certyfikatu SSL"
    >
      <template #description>
        Może to spowodować potencjalne zagrożenie bezpieczeństwa danych, które zostaną przesłane na
        powyższy adres. Użycie protokołu <code>https</code> jest mocno zalecane.
      </template>
    </a-alert>

    <div class="webhook-form__switches">
      <switch-input v-model="form.with_issuer" horizontal :disabled="disabled">
        <template #title>
          Z podmiotem akcji
          <a-tooltip>
            <template #title>
              <small>
                Jeśli zaznaczone, żądanie będzie zawierać informacje o użytkowniku (lub aplikacji),
                który spowodował daną akcję. Np. zawarta będzie informacja o osobie która zedytowała
                produkt.
              </small>
            </template>
            <i class="bx bxs-info-circle"></i>
          </a-tooltip>
        </template>
      </switch-input>

      <switch-input v-model="form.with_hidden" horizontal :disabled="disabled">
        <template #title>
          Z ukrytymi wpisami
          <a-tooltip>
            <template #title>
              <small>
                Jeśli zaznaczone, żądanie będzie wykonywane również dla obiektów, które są w
                systemie ukryte. Np. edycja ukrytego produktu.
              </small>
            </template>
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
      Użyj tego tokena do sprawdzenia poprawności i autentyczności otrzymanego webhooka. Zostanie
      użyty do zahashowania (<code>sha256</code>) payloadu żądania, a następnie zostanie wysyłany
      wraz z żądaniem w nagłówku HTTP <code>Signature</code>.
    </small>

    <br />

    <h3>Wydarzenia wywołujące webhooka:</h3>
    <div class="webhook-form__events">
      <a-checkbox
        v-for="ev in allEvents"
        :key="ev.key"
        :checked="has(ev.key)"
        :disabled="disabled"
        @change="toggle(ev.key)"
      >
        <span class="ant-checkbox__title">{{ ev.name || ev.key }}</span>
        <small class="ant-checkbox__description">{{ ev.description }}</small>
      </a-checkbox>
    </div>
    <small class="danger-text">{{ error }}</small>

    <br />
    <app-button :disabled="disabled" @click.stop="handleSubmit(submit)"> Zapisz </app-button>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationObserver } from 'vee-validate'

import { WebHookDto, WebHookEvent, WebHookEventObject } from '@/interfaces/Webhook'

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
  data: () => ({
    error: null as string | null,
  }),
  computed: {
    form: {
      get(): WebHookDto {
        return this.value
      },
      set(discount: WebHookDto) {
        this.$emit('input', discount)
      },
    },
    allEvents(): WebHookEventObject[] {
      return this.$accessor.webhooks.events
    },
    hasHttps(): boolean {
      return this.form.url.startsWith('https://')
    },
  },
  watch: {
    ['form.events'](events) {
      this.error = events.length === 0 ? 'Musisz wybrać przynajmniej jedno wydarzenie' : null
    },
  },
  methods: {
    submit() {
      if (this.form.events.length === 0) return
      this.$emit('submit', this.form)
    },
    toggle(key: WebHookEvent) {
      if (this.has(key)) {
        this.form.events = this.form.events.filter((ev) => ev !== key)
      } else {
        this.form.events.push(key)
      }
    },

    has(key: WebHookEvent) {
      return this.form.events.includes(key)
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

  &__events {
    display: grid;
    grid-template-columns: 1fr 1fr;

    @media ($max-viewport-5) {
      grid-template-columns: 1fr;
    }
  }

  .ant-alert {
    margin-bottom: 16px;
  }

  .bx {
    color: $primary-color-300;
  }
}
</style>