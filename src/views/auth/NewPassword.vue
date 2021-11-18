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
        <app-button type="primary" @click="handleSubmit(changePassword)"> Zmień hasło </app-button>
      </div>
    </ValidationObserver>
  </central-screen-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { api } from '@/api'

export default Vue.extend({
  metaInfo: { title: 'Nowe hasło' },
  components: {
    CentralScreenForm,
    ValidationObserver,
  },
  data: () => ({
    password: '',
    repeatPassword: '',
    isSuccess: false,
  }),
  computed: {
    error(): any {
      return this.$accessor.auth.error
    },
  },
  watch: {
    error(error: any) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    const { token, email } = this.$route.query

    try {
      if (!token || !email) throw new Error('Token or email does not exist')
      await api.get(`/users/reset-password?token=${token}&email=${email}`)
    } catch (e: any) {
      this.$toast.error(formatApiNotificationError(e))
      this.$router.replace('/login')
    }
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
        this.$toast.success('Hasło zostało zmienione')
        this.$router.push({ name: 'Login' })
      }
    },
  },
})
</script>
