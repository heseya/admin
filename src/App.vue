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
import { init as initMicroApps, onMounted } from 'microfront-lib'

import Navigation from './layout/Navigation.vue'

export default {
  components: {
    Navigation,
  },
  created() {
    initMicroApps()
    this.$accessor.fetchEnv()

    const tokenChannel = new BroadcastChannel('token')

    onMounted(() => {
      tokenChannel.postMessage(this.$store.state.auth.token)
    })
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

hr {
  all: unset;
  display: block;
  height: 1px;
  background-color: #eee;
  width: 100%;
  margin: 12px 0;
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
