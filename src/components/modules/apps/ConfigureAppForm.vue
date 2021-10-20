<template>
  <validation-observer v-slot="{ handleSubmit }">
    <div class="configure-app-form">
      <loading :active="isLoading" />

      <a-alert
        v-if="error"
        type="error"
        show-icon
        message="Nie udało się pobrać konfiguracji aplikacji"
        :description="error.message"
      />

      <template v-for="field in fields">
        <app-select
          v-if="field.type === 'select'"
          :key="field.key"
          v-model="form[field.key]"
          :label="field.label"
        >
          <a-select-option v-for="{ value, label } in field.options" :key="value" :value="value">
            {{ label }}
          </a-select-option>
        </app-select>

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
          Zapisz konfiguracje
        </app-button>
      </div>
    </div>
  </validation-observer>
</template>

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

      try {
        this.isLoading = true

        const { data } = await this.appApi.get<AppConfigField[]>('/config')

        this.fields = data
        this.form = this.fields.reduce(
          (acc, field) => ({ ...acc, [field.key]: field.value || field.default_value }),
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

        this.$toast.success('Konfiguracja została zapisana')
        this.$emit('close')
      } catch (e: unknown) {
        const error = e as AxiosError<{ message?: string }>
        const message = error.response?.data?.message || error.message

        this.$toast.error(
          formatApiNotification({
            title: 'Wystąpił błąd podczas zapisywania konfiguracji',
            text: message,
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
}
</style>
