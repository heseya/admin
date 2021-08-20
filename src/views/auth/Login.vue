<template>
  <central-screen-form title="Logowanie">
    <ValidationObserver v-slot="{ handleSubmit }">
      <validated-input
        rules="required|email"
        v-model="email"
        label="E-mail"
        type="email"
        @keydown.enter="handleSubmit(login)"
      />
      <br /><br />
      <validated-input
        rules="required"
        v-model="password"
        label="Hasło"
        type="password"
        @keydown.enter="handleSubmit(login)"
      />
      <br />

      <div class="central-screen-form__row">
        <vs-button dark @click="handleSubmit(login)"> Zaloguj </vs-button>
        <vs-button transparent dark to="/reset-password"> Zapomniałeś hasła? </vs-button>
      </div>
    </ValidationObserver>
  </central-screen-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import { formatApiError } from '@/utils/errors'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

const DEBUG = process.env.NODE_ENV === 'development'

export default Vue.extend({
  components: {
    CentralScreenForm,
    ValidatedInput,
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
    loginError(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
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
