<template>
  <validation-observer v-slot="{ handleSubmit, errors }" class="webhook-form">
    <validated-input
      v-model="form.name"
      :disabled="disabled"
      name="name"
      :label="$t('common.form.name')"
    />
    <validated-input
      v-model="form.url"
      :disabled="disabled"
      name="url"
      rules="required|url"
      :label="$t('common.form.slug')"
    />

    <a-alert
      v-if="!hasHttps && form.url && errors.url && errors.url.length === 0"
      type="warning"
      show-icon
      :message="$t('httpsAlert.title')"
    >
      <template #description>
        <div v-html="$t('httpsAlert.description')" />
      </template>
    </a-alert>

    <div class="webhook-form__switches">
      <switch-input v-model="form.with_issuer" horizontal :disabled="disabled">
        <template #title>
          {{ $t('withIssuer.title') }}
          <info-tooltip>
            <small>
              {{ $t('withIssuer.description') }}
            </small>
          </info-tooltip>
        </template>
      </switch-input>

      <switch-input v-model="form.with_hidden" horizontal :disabled="disabled">
        <template #title>
          {{ $t('withHidden.title') }}
          <info-tooltip>
            <small>
              {{ $t('withHidden.description') }}
            </small>
          </info-tooltip>
        </template>
      </switch-input>
    </div>

    <validated-input
      v-model="form.secret"
      :disabled="disabled"
      name="secret"
      :label="$t('secret.title')"
    />
    <small v-html="$t('secret.description')"> </small>

    <br />

    <h3>{{ $t('events') }}</h3>
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
    <app-button :disabled="disabled" @click.stop="handleSubmit(submit)">
      {{ $t('common.save') }}
    </app-button>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "httpsAlert": {
      "title": "Link docelowy webhooka nie posiada certyfikatu SSL",
      "description": "Może to spowodować potencjalne zagrożenie bezpieczeństwa danych, które zostaną przesłane na powyższy adres. Użycie protokołu <code>https</code> jest mocno zalecane."
    },
    "withIssuer": {
      "title": "Z podmiotem akcji",
      "description": "Jeśli zaznaczone, żądanie będzie zawierać informacje o użytkowniku (lub aplikacji), który spowodował daną akcję. Np. zawarta będzie informacja o osobie która zedytowała produkt."
    },
    "withHidden": {
      "title": "Z ukrytymi wpisami",
      "description": "Jeśli zaznaczone, żądanie będzie wykonywane również dla obiektów, które są w systemie ukryte. Np. edycja ukrytego produktu."
    },
    "secret": {
      "title": "Sekretny token",
      "description": "Użyj tego tokena do sprawdzenia poprawności i autentyczności otrzymanego webhooka. Zostanie użyty do zahashowania (<code>sha256</code>) payloadu żądania, a następnie zostanie wysyłany wraz z żądaniem w nagłówku HTTP <code>Signature</code>."
    },
    "events": "Wydarzenia wywołujące webhooka:",
    "error": {
      "empty": "Musisz wybrać przynajmniej jedno wydarzenie",
      "httpsRequired": "Protokół https jest wymagany, ponieważ conajmniej jedno z wybranych wydarzeń jest szyfrowane"
    }
  },
  "en": {
    "httpsAlert": {
      "title": "The target webhook does not have a SSL certificate",
      "description": "This may cause data security risks, as the data will be sent to the target address. Using <code>https</code> is strongly recommended."
    },
    "withIssuer": {
      "title": "With issuer",
      "description": "If checked, the request will contain information about the user (or application) that caused the action. For example, a request will contain information about the person who edited the product."
    },
    "withHidden": {
      "title": "With hidden",
      "description": "If checked, the request will be sent also for hidden objects. For example, editing a hidden product."
    },
    "secret": {
      "title": "Secret token",
      "description": "Use this token to verify the authenticity of the webhook. It will be used to hash the payload of the request (<code>sha256</code>), and then sent along with the request in the HTTP <code>Signature</code> header."
    },
    "events": "Events triggering the webhook:",
    "error": {
      "empty": "You must select at least one event ",
      "httpsRequired": "Https protocol is required because at least one of the selected events is encrypted"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { WebhookEntryUpdateDto, WebhookEventType, WebHookEventObject } from '@heseya/store-core'

export default defineComponent({
  components: {
    ValidationObserver,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<WebhookEntryUpdateDto>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): WebhookEntryUpdateDto {
        return this.value
      },
      set(discount: WebhookEntryUpdateDto) {
        this.$emit('input', discount)
      },
    },
    allEvents(): WebHookEventObject[] {
      return this.$accessor.webhooks.events
    },
    hasHttps(): boolean {
      return this.form.url.startsWith('https://')
    },
    error(): string | null {
      if (!this.form.events.length) {
        return `${this.$t('error.empty')}`
      } else {
        return this.form.events.some((event) => this.isEncrypted(event)) && !this.hasHttps
          ? `${this.$t('error.httpsRequired')}`
          : null
      }
    },
  },
  methods: {
    submit() {
      if (this.error) return
      this.$emit('submit', this.form)
    },
    toggle(key: WebhookEventType) {
      if (this.has(key)) {
        this.form.events = this.form.events.filter((ev) => ev !== key)
      } else {
        this.form.events.push(key)
      }
    },
    has(key: WebhookEventType) {
      return this.form.events.includes(key)
    },
    isEncrypted(key: WebhookEventType) {
      return this.allEvents.find((event) => event.key === key)?.encrypted
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
    display: grid;
    grid-auto-flow: column;
    gap: 8px;
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
    color: var(--primary-color-300);
  }
}
</style>
