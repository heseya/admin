<template>
  <validation-observer v-slot="{ handleSubmit }">
    <div class="configure-app-form">
      <loading :active="isLoading" />

      <a-alert
        v-if="error"
        type="error"
        show-icon
        :message="$t('fetchFailed')"
        :description="error.message"
      />

      <template v-for="field in fields">
        <app-select
          v-if="field.type === 'select'"
          :key="field.key"
          v-model="form[field.key]"
          option-filter-prop="label"
          :label="field.label"
        >
          <a-select-option v-for="{ value, label } in field.options" :key="value" :label="label">
            {{ label }}
          </a-select-option>
        </app-select>

        <switch-input
          v-else-if="field.type === 'checkbox'"
          :key="field.key"
          v-model="form[field.key]"
          horizontal
          :label="field.label"
        />

        <validated-input
          v-else
          :key="field.key"
          v-model="form[field.key]"
          :label="field.label"
          :type="field.type"
          :placeholder="field.placeholder"
          :rules="field.required ? 'required' : null"
        />
      </template>

      <br />

      <div class="configure-app-form__btns">
        <app-button :disabled="!!error" @click="handleSubmit(changeAppConfig)">
          {{ $t('save') }}
        </app-button>
      </div>
    </div>
  </validation-observer>
</template>

<i18n>
{
  "pl": {
    "fetchFailed": "Nie udało się pobrać konfiguracji aplikacji",
    "save": "Zapisz konfigurację",
    "savedSuccess": "Konfiguracja została zapisana",
    "savedError": "Nie udało się zapisać konfiguracji aplikacji"
  },
  "en": {
    "fetchFailed": "Failed to fetch app configuration",
    "save": "Save configuration",
    "savedSuccess": "Configuration saved",
    "savedError": "Failed to save configuration"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { AxiosError, AxiosInstance } from 'axios'

import Loading from '@/components/layout/Loading.vue'

import { App, AppConfigField } from '@/interfaces/App'

import { formatApiNotification } from '@/utils/utils'
import { createApiInstance } from '@/api'
import AppSelect from '@/components/form/AppSelect.vue'

export default Vue.extend({
  components: { ValidationObserver, Loading, AppSelect },
  props: {
    app: {
      type: Object,
      default: null,
    } as Vue.PropOptions<App | null>,
  },
  data: () => ({
    form: {} as Record<string, any>,
    fields: [] as AppConfigField[],
    error: null as null | Error,
    isLoading: false,
  }),
  computed: {
    appApi(): AxiosInstance | null {
      return this.app ? createApiInstance(this.app.url, false) : null
    },
  },
  watch: {
    app() {
      this.fetchAppConfigFields()
    },
  },
  created() {
    this.fetchAppConfigFields()
  },
  methods: {
    async fetchAppConfigFields() {
      if (!this.app || !this.appApi) return

      // Clear form
      this.error = null
      this.fields = []
      this.form = {}

      try {
        this.isLoading = true

        const { data } = await this.appApi.get<AppConfigField[]>('/config')

        this.fields = data
        this.form = this.fields.reduce(
          (acc, field) => ({ ...acc, [field.key]: field.value ?? field.default_value }),
          {},
        )
      } catch (e: unknown) {
        this.error = e as AxiosError
      }
      this.isLoading = false
    },
    async changeAppConfig() {
      if (!this.appApi) return

      try {
        this.isLoading = true

        await this.appApi.post('/config', this.form)

        this.$toast.success(this.$t('savedSuccess') as string)
        this.$emit('close')
      } catch (e: unknown) {
        const error = e as AxiosError<{ message?: string }>
        const message = error.response?.data?.message || error.message

        this.$toast.error(
          formatApiNotification({
            title: this.$t('savedError') as string,
            messages: [message],
          }),
        )
      }
      this.isLoading = false
    },
  },
})
</script>

<style lang="scss">
.configure-app-form {
  &__btns {
    display: flex;
    justify-content: space-between;
  }

  .switch-input {
    margin-bottom: 12px;

    &__label {
      margin-right: auto;
      font-weight: 400;
    }
  }
}
</style>
