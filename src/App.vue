<template>
  <div id="app" class="app" :class="{ 'app--full-size': isNavHidden }">
    <DesktopNavigation class="app__nav"></DesktopNavigation>
    <MobileNavigation class="app__mobile-nav"></MobileNavigation>

    <AppHeader class="app__header"></AppHeader>

    <main class="app__content">
      <transition name="fade" mode="out-in">
        <router-view :key="$route.path" />
      </transition>
    </main>

    <Loading :relative="false" :active="isLoading" />

    <sw-update-popup />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { first, isArray } from 'lodash'
import { init as initMicroApps, onMounted, openCommunicationChannel } from 'bout'

import DesktopNavigation from './components/root/DesktopNavigation.vue'
import MobileNavigation from './components/root/MobileNavigation.vue'
import AppHeader from './components/root/Header.vue'
import Loading from './components/layout/Loading.vue'
import SwUpdatePopup from './components/root/SwUpdatePopup.vue'

import { onTokensSync } from './utils/authSync'
import { getApiURL } from './utils/api'

export default Vue.extend({
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
  },
  computed: {
    isLoading(): boolean {
      return this.$accessor.loading
    },
    isNavHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
    tokenChannel() {
      return openCommunicationChannel('Token')
    },
    mainChannel() {
      return openCommunicationChannel('Main')
    },
  },
  watch: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    '$accessor.auth.permissionsError'(_permissionsError) {
      this.$toast.error('Nie posiadasz uprawnień do tej akcji')
    },

    '$accessor.auth.getIdentityToken'(token) {
      this.tokenChannel.emit('set', token)
    },
  },
  created() {
    initMicroApps()
    this.$accessor.fetchEnv()
    if (this.$accessor.auth.isLogged) this.$accessor.auth.fetchProfile()

    // MicroFrontend Events Start
    onMounted(() => {
      // ! deprecated: remove before 3.0.0
      this.tokenChannel.emit('set', this.$accessor.auth.getIdentityToken)

      this.mainChannel.emit('init', {
        coreUrl: getApiURL(),
        token: this.$accessor.auth.getIdentityToken,
        user: this.$accessor.auth.user,
      })
    })

    this.tokenChannel.on<undefined>('refresh', async () => {
      const { identityToken } = await this.$accessor.auth.refreshToken()
      return identityToken
    })
    // MicroFrontend Events End

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
          const nextURL = (isArray(next) ? first(next) : next) || '/'
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
}
</style>
