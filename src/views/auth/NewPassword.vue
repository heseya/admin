<template>
  <central-screen-form title="Nowe hasło">
    <ValidationObserver v-slot="{ handleSubmit }">
      <validated-input
        v-model="password"
        name="password"
        rules="required|password"
        label="Nowe hasło"
        type="password"
        @keydown.enter="handleSubmit(changePassword)"
      />
      <br />
      <br />
      <validated-input
        v-model="repeatPassword"
        name="repeatPassword"
        rules="required|repeatPassword:@password"
        label="Powtórz nowe hasło"
        type="password"
        @keydown.enter="handleSubmit(changePassword)"
      />
      <br />

      <div class="central-screen-form__row">
        <vs-button dark @click="handleSubmit(changePassword)"> Zmień hasło </vs-button>
      </div>
    </ValidationObserver>
  </central-screen-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { formatApiError } from '@/utils/errors'

export default Vue.extend({
  components: {
    CentralScreenForm,
    ValidatedInput,
    ValidationObserver,
  },
  data() {
    return {
      password: '',
      repeatPassword: '',
      isSuccess: false,
    }
  },
  computed: {
    error(): any {
      return this.$store.state.auth.error
    },
  },
  watch: {
    error(error: any) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
      }
    },
  },
  methods: {
    async changePassword() {
      this.$accessor.startLoading()
      const isSuccess = await this.$accessor.auth.resetPassword({
        email: this.$route.query.email as string,
        token: this.$route.query.token as string,
        password: this.password,
      })
      this.$accessor.stopLoading()

      if (isSuccess) {
        this.$vs.notification({
          color: 'success',
          title: 'Hasło zostało zmienione',
        })
        this.$router.push({ name: 'Login' })
      }
    },
  },
})
</script>
