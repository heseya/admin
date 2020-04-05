<template>
  <div id="app">
    <navigation></navigation>

    <main class="main">

      <transition name="fade">
        <router-view/>
      </transition>

    </main>
  </div>
</template>

<script>
import Navigation from './layout/Navigation.vue'

export default {
  components: {
    Navigation
  }
}
</script>

<style lang="scss">
@font-face{
  font-family:'Tw Cen MT';
  font-style: normal;
  font-weight: 400;
  src: local('Tw Cen MT'), url(/fonts/TwCenMT.woff) format('woff');
}

body {
  font-family: 'BlinkMacSystemFont', 'Roboto', sans-serif;
  background: #f4f7f8;
  margin: 0;
}

.main {
  max-width: 940px;
  padding: 0 20px;
  margin: 0 auto;
  margin-bottom: 80px;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
