<template>
  <div class="app-containter">
    <micro-frontend name="Test" host="//localhost:5000/" history="{}" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MicroFrontend from '@/components/MicroFrontend.vue'

export default Vue.extend({
  components: { MicroFrontend },
})
</script>

<style lang="scss" scoped>
.app-containter {
}
</style>
