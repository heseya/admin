<template>
  <central-screen-form title="Logowanie">
    <login-form v-model="form" @submit="login" />
  </central-screen-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { first, isArray } from 'lodash'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import LoginForm from '@/components/modules/auth/LoginForm.vue'

import { formatApiNotificationError } from '@/utils/errors'

const DEFAULT_CREDENTIALS = process.env.NODE_ENV === 'development'

export default Vue.extend({
  metaInfo: { title: 'Logowanie' },
  components: {
    CentralScreenForm,
    LoginForm,
  },
  data: () => ({
    form: {
      email: DEFAULT_CREDENTIALS ? '***REMOVED***' : '',
      password: DEFAULT_CREDENTIALS ? '***REMOVED***' : '',
    },
  }),
  computed: {
    nextURL(): string {
      const { next } = this.$route.query
      return (isArray(next) ? first(next) : next) || '/'
    },
  },
  watch: {
    '$accessor.auth.error'(error: any) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  methods: {
    async login() {
      this.$accessor.startLoading()
      const success = await this.$accessor.auth.login(this.form)
      if (success) this.$router.push(this.nextURL)
      this.$accessor.stopLoading()
    },
  },
})
</script>
