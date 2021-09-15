<template>
  <validation-observer v-slot="{ handleSubmit }">
    <div class="configure-app-form">
      <validated-input
        v-for="field in fields"
        :key="field.key"
        v-model="form[field.key]"
        :label="field.label"
        :type="field.type"
        :placeholder="field.placeholder"
        :rules="field.required ? 'required' : null"
      />

      <br />

      <div class="configure-app-form__btns">
        <app-button @click="handleSubmit(changeAppConfig)">Zapisz konfiguracje</app-button>
        <pop-confirm
          title="Czy na pewno chcesz odinstalować tę aplikację?"
          ok-text="Usuń"
          cancel-text="Anuluj"
          @confirm="$emit('uninstall')"
        >
          <app-button type="danger">Odinstaluj</app-button>
        </pop-confirm>
      </div>
    </div>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import axios from 'axios'

import { App } from '@/interfaces/App'
import { formatApiNotification } from '@/utils/utils'
import PopConfirm from '@/components/layout/PopConfirm.vue'

interface AppConfigField {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'number' | 'color' | 'date' | 'datetime-local'
  // eslint-disable-next-line camelcase
  default_value: any
  required: boolean
  value?: any
}

export default Vue.extend({
  components: { ValidationObserver, PopConfirm },
  props: {
    app: {
      type: Object,
      required: true,
    } as Vue.PropOptions<App>,
  },
  data: () => ({
    form: {} as Record<string, any>,
    fields: [] as AppConfigField[],
    isError: false,
    isLoading: false,
  }),
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
      if (!this.app) return

      try {
        this.isLoading = true

        const { data } = await axios.get<AppConfigField[]>(`${this.app.url}/config`)

        this.fields = data
        this.form = this.fields.reduce(
          (acc, field) => ({ ...acc, [field.key]: field.value || field.default_value }),
          {},
        )
      } catch (e) {
        formatApiNotification({
          title: 'Nie udało się pobrać konfiguracji aplikacji',
          text: e.message,
        })
        this.$emit('close')
      }
      this.isLoading = false
    },
    async changeAppConfig() {
      try {
        this.isLoading = true

        await axios.post(`${this.app.url}/config`, this.form)

        this.$toast.success('Konfiguracja została zapisana')
        this.$emit('close')
      } catch (e) {
        this.$toast.error(
          formatApiNotification({
            title: 'Wystąpił błąd podczas zapisywania konfiguracji',
            text: e.message,
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
