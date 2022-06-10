<template>
  <div class="qr-code-scanner">
    <video ref="camera" class="qr-code-scanner__camera"></video>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import QrScanner from 'qr-scanner'

export default Vue.extend({
  data: () => ({
    scanner: null as null | QrScanner,
  }),

  mounted() {
    this.scanner = new QrScanner(this.$refs.camera as HTMLVideoElement, this.handleScanResult, {
      highlightScanRegion: true,
      onDecodeError: this.handleScanError,
    })
    this.scanner.start()
  },

  beforeDestroy() {
    this.scanner!.destroy()
  },

  methods: {
    handleScanError(e: Error | string) {
      if (e instanceof Error) this.$toast.error(e.message)
    },
    handleScanResult(result: QrScanner.ScanResult) {
      console.log('Scan result', result)
    },
  },
})
</script>

<style lang="scss" scoped>
.qr-code-scanner {
  width: 100%;

  &__camera {
    width: 100%;
  }
}
</style>
