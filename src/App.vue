<template>
  <div id="app">
    <navigation></navigation>

    <main class="main">
      <transition name="fade">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script>
import Navigation from './layout/Navigation.vue'

export default {
  components: {
    Navigation,
  },
  created() {
    this.$store.dispatch('fetchEnv')
  },
}
</script>

<style lang="scss">
@font-face {
  font-family: 'Tw Cen MT';
  font-style: normal;
  font-weight: 400;
  src: local('Tw Cen MT'), url(/fonts/TwCenMT.woff) format('woff');
}

body {
  font-family: 'BlinkMacSystemFont', 'Roboto', sans-serif;
  background: #f4f7f8;
  margin: 0;
}

input {
  width: 100% !important;
}

.main {
  max-width: 940px;
  padding: 0 20px;
  margin: 0 auto;
  margin-bottom: 80px;
}

.row {
  display: flex;
  justify-content: space-between;
}

.flex-column {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.label {
  display: block;
  margin-left: 5px;
  margin-bottom: 3px;
  color: #000 !important;
  font-size: 0.75rem;
  font-weight: 500;
}

.flex {
  display: flex;
}
</style>
