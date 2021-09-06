<template>
  <central-screen-form title="Logowanie">
    <ValidationObserver v-slot="{ handleSubmit }">
      <validated-input
        v-model="email"
        rules="required|email"
        label="E-mail"
        type="email"
        @keydown.enter="handleSubmit(login)"
      />
      <br /><br />
      <validated-input
        v-model="password"
        rules="required"
        label="Hasło"
        type="password"
        @keydown.enter="handleSubmit(login)"
      />
      <br />

      <div class="central-screen-form__row">
        <app-button @click="handleSubmit(login)"> Zaloguj </app-button>
        <app-button type="white" to="/reset-password"> Zapomniałeś hasła? </app-button>
      </div>
    </ValidationObserver>
  </central-screen-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import { formatApiNotificationError } from '@/utils/errors'

const DEBUG = process.env.NODE_ENV === 'development'

export default Vue.extend({
  metaInfo: { title: 'Logowanie' },
  components: {
    CentralScreenForm,
    ValidationObserver,
  },
  data: () => ({
    email: DEBUG ? '***REMOVED***' : '',
    password: DEBUG ? '***REMOVED***' : '',
  }),
  computed: {
    loginError() {
      return this.$accessor.auth.error
    },
  },
  watch: {
    loginError(error: any) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  methods: {
    async login() {
      this.$accessor.startLoading()
      const success = await this.$accessor.auth.login({
        email: this.email,
        password: this.password,
      })
      if (success) this.$router.push({ name: 'Home' })
      this.$accessor.stopLoading()
    },
  },
})
</script>
