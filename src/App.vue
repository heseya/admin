<template>
  <div id="app" class="app">
    <AppNavigation class="app__nav"></AppNavigation>
    <AppHeader class="app__header"></AppHeader>

    <main class="app__content">
      <transition name="fade">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppNavigation from './components/root/Navigation.vue'
import AppHeader from './components/root/Header.vue'

export default Vue.extend({
  components: {
    AppNavigation,
    AppHeader,
  },
  data: () => ({
    loadingInstance: null as null | { close: () => void },
  }),
  computed: {
    isLoading(): boolean {
      return this.$accessor.loading
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
  padding-left: 250px;

  &__nav {
  }

  &__header {
  }

  &__content {
    max-width: calc(100% - 48px);
    width: 100%;
    box-sizing: border-box;
    padding: 32px 24px;
    margin: 0 auto;
  }
}
</style>
