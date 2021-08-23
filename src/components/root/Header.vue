<template>
  <header class="header">Top App Header</header>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'AppHeader',
})
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  border-bottom: dashed 1px #ccc;
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
