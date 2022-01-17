<template>
  <div class="recovery-codes">
    <code v-for="code in codes" :key="code" @click="copy"> {{ code }} </code>
    <small>Kliknij w kody, aby je skopiować do schowka</small>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    codes: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<string[]>,
  },
  mounted() {
    navigator.permissions.query({ name: 'clipboard-write' as PermissionName })
  },
  methods: {
    async copy() {
      await navigator.clipboard.writeText(this.codes.join('\n'))
      this.$toast.info('Kody zostały skopiowane do schowka')
    },
  },
})
</script>

<style lang="scss" scoped>
.recovery-codes {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 16px;

  code {
    margin: 4px;
    font-size: 2em;
  }
}
</style>
