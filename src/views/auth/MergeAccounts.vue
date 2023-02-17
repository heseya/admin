<template>
  <central-screen-form>
    <div class="merge-accounts-page">
      <loading :active="isLoading" />
      <h1 class="merge-accounts-page__title">{{ $t('title') }}</h1>
      <p>{{ $t('description') }}</p>
      <app-button class="merge-accounts-page__btn" type="primary" @click="mergeAccounts">
        {{ $t('button') }}
      </app-button>
      <app-button class="merge-accounts-page__btn" type="white" to="/">
        {{ $t('common.cancel') }}
      </app-button>
    </div>
  </central-screen-form>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Łączenie kont",
    "description": "Za chwilę połączymy twoje konta. Dzięki temu, będziesz mógł logować się do jednego konta zarówno za pośrednictwem loginu i hasła, jak i za pośrednictwem konta społecznościowego.",
    "button": "Potwierdzam, połącz konta",
    "success": "Konta zostały połączone"
  },
  "en": {
    "title": "Merging accounts",
    "description": "Merging accounts",
    "button": "Confirm, merge accounts",
    "success": "Accounts have been merged"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import Loading from '@/components/layout/Loading.vue'
import { formatApiNotificationError } from '@/utils/errors'
import { sdk } from '@/api'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },

  components: {
    CentralScreenForm,
    Loading,
  },

  data: () => ({
    isLoading: false,
  }),

  computed: {
    mergeToken(): string {
      return this.$route.query.token as string
    },
  },

  async mounted(): Promise<unknown> {
    if (!this.mergeToken) return this.$router.push({ name: 'Login' })
  },

  methods: {
    async mergeAccounts() {
      this.isLoading = true
      try {
        await sdk.Auth.Providers.mergeAccount(this.mergeToken)
        this.$toast.success(this.$t('success') as string)
        this.$router.push('/')
      } catch (error: any) {
        this.$toast.error(formatApiNotificationError(error))
        await this.$accessor.auth.logout()
        this.$router.push('/login')
      }
      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.merge-accounts-page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__btn {
    margin-top: 16px;
  }
}
</style>
