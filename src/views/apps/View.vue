<template>
  <div class="micro-app-containter">
    <micro-frontend app-key="TestApp" host="//localhost:5000/" />
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
.micro-app-containter {
}
</style>
