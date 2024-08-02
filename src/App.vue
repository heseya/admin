<template>
  <div id="app" class="app" :class="{ 'app--full-size': isNavHidden }">
    <DesktopNavigation class="app__nav" />
    <MobileNavigation class="app__mobile-nav" />

    <AppHeader class="app__header" />

    <main class="app__content">
      <transition name="fade" mode="out-in">
        <router-view :key="viewKey" />
      </transition>
    </main>

    <!-- eslint-disable-next-line vue/no-bare-strings-in-template -->
    <div class="app__version" :class="{ 'app__version--center': !isNavHidden }">
      &copy; {{ currentYear }} | v{{ version }}
    </div>

    <Loading :relative="false" :active="isLoading" />

    <SwUpdatePopup />
    <OfflineBanner />
    <floating-qr-scanner v-if="$accessor.auth.isLogged" />
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "noPermissionError": "You don't have permission to this action."
  },
  "pl": {
    "noPermissionError": "Nie posiadasz uprawnień do tej akcji."
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { first } from 'lodash'
import pkg from '../package.json'
import { init as initMicroApps } from 'bout'

import DesktopNavigation from './components/root/DesktopNavigation.vue'
import MobileNavigation from './components/root/MobileNavigation.vue'
import AppHeader from './components/root/Header.vue'
import Loading from './components/layout/Loading.vue'
import SwUpdatePopup from './components/root/SwUpdatePopup.vue'
import FloatingQrScanner from './components/modules/qrCode/FloatingScanner.vue'
import OfflineBanner from './components/root/OfflineBanner.vue'

import { onTokensSync } from './utils/authSync'

export default defineComponent({
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Admin',
    // all titles will be injected into this template
    titleTemplate: '%s | Heseya',
  },
  components: {
    DesktopNavigation,
    MobileNavigation,
    AppHeader,
    Loading,
    SwUpdatePopup,
    OfflineBanner,
    FloatingQrScanner,
  },
  computed: {
    viewKey(): string {
      return `${this.$accessor.config.apiLanguage}:${this.$accessor.config.salesChannel?.id}:${this.$route.path}`
    },
    isLoading(): boolean {
      return this.$accessor.loading
    },
    isNavHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
    currentYear(): string {
      return new Date().getFullYear().toString()
    },
    version(): string {
      return pkg.version
    },
  },
  watch: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    '$accessor.auth.permissionsError'(_permissionsError) {
      this.$toast.error(this.$t('noPermissionError') as string)
    },
  },
  created() {
    initMicroApps()
    this.$accessor.config.fetchSettings()
    this.$accessor.config.fetchCurrencies()
    this.$accessor.salesChannels.fetch().then(() => {
      this.$accessor.config.initSalesChannel()
    })
    this.$accessor.config.initLanguages()
    this.$accessor.menuItems.initMicrofrontendMenuItems()
    if (this.$accessor.auth.isLogged) this.$accessor.auth.fetchProfile()

    // MultiTabs Token Sync Start
    onTokensSync(async (tokens) => {
      if (tokens) {
        const wasLogged = this.$accessor.auth.isLogged

        // Update tokens
        this.$accessor.auth.setTokens(tokens)

        if (!wasLogged) {
          // Login user
          await this.$accessor.auth.fetchProfile()

          const { next } = this.$route.query
          const nextURL = (Array.isArray(next) ? first(next) : next) || '/'
          this.$router.push(nextURL)
        }
      } else {
        // Logout user
        this.$accessor.auth.clearAuth()
        this.$router.push({
          name: 'Login',
          query: { next: this.$route.fullPath !== '/' ? this.$route.fullPath : undefined },
        })
      }
    })
    // MultiTabs Token Sync End
  },
})
</script>

<style lang="scss" src="@/scss/base.scss"></style>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  transition: padding 0.3s;
  min-height: 100vh;

  @media ($viewport-11) {
    padding-left: $navWidth;
  }
  @media ($max-viewport-11) {
    padding-bottom: 140px;
  }

  &--full-size {
    padding-left: 0 !important;
    padding-bottom: 0 !important;
  }

  &__nav {
    @media ($max-viewport-11) {
      display: none !important;
    }
  }

  &__mobile-nav {
    @media ($viewport-11) {
      display: none !important;
    }
  }

  &__content {
    width: 100%;
    box-sizing: border-box;
    padding: 24px 12px;
    margin: 0 auto;

    @media ($viewport-7) {
      padding: 32px 24px;
    }
  }

  &__version {
    position: fixed;
    display: block;
    left: 0;
    bottom: 0;
    padding: 10px;
    width: $navWidth;
    font-size: 0.7em;
    color: var(--gray-color-400);

    &--center {
      text-align: center;
    }
  }
}
</style>
