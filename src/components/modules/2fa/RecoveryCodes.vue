<template>
  <div class="recovery-codes">
    <code v-for="code in codes" :key="code" @click="copy"> {{ code }} </code>
    <small>{{ $t('message') }}</small>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "message": "Kliknij w kody, aby je skopiować do schowka",
    "copied": "Kody zostały skopiowane do schowka"
  },
  "en": {
    "message": "Click on the codes to copy them to clipboard",
    "copied": "Codes have been copied to clipboard"
  }
}
</i18n>

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
      this.$toast.info(this.$t('copied') as string)
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
