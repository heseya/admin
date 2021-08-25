<template>
  <div id="app" class="app" :class="{ 'app--full-size': isHidden }">
    <DesktopNavigation class="app__nav"></DesktopNavigation>
    <MobileNavigation class="app__mobile-nav"></MobileNavigation>

    <AppHeader class="app__header"></AppHeader>

    <main class="app__content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DesktopNavigation from './components/root/DesktopNavigation.vue'
import MobileNavigation from './components/root/MobileNavigation.vue'
import AppHeader from './components/root/Header.vue'

export default Vue.extend({
  components: {
    DesktopNavigation,
    MobileNavigation,
    AppHeader,
  },
  data: () => ({
    loadingInstance: null as null | { close: () => void },
  }),
  computed: {
    isLoading(): boolean {
      return this.$accessor.loading
    },
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
  },
  watch: {
    isLoading(isLoading: boolean) {
      if (isLoading) {
        this.loadingInstance = this.$vs.loading({ color: '#000' })
      } else if (this.loadingInstance) {
        this.loadingInstance.close()
      }
    },
    '$accessor.auth.permissionsError'(_permissionsError) {
      this.$vs.notification({
        color: 'danger',
        title: 'Brak uprawnień',
        text: `Nie posiadasz uprawnień do tej akcji`,
      })
    },
  },
  created() {
    this.$accessor.fetchEnv()
    if (this.$accessor.auth.isLogged) this.$accessor.auth.fetchProfile()
  },
})
</script>

<style lang="scss" src="@/scss/base.scss"></style>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  transition: padding 0.3s;

  @media ($viewport-11) {
    padding-left: $navWidth;
  }
  @media ($max-viewport-11) {
    padding-bottom: 60px;
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

  &__header {
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
