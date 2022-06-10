<template>
  <div class="qr-code-scanner">
    <video ref="camera" class="qr-code-scanner__camera"></video>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import QrScanner from 'qr-scanner'
import { QrCodePayload } from '@/interfaces/QrCode'

const validateQrCode = (object: any): object is QrCodePayload =>
  object?.v === 1 && typeof object.cty === 'string' && typeof object.body === 'object'

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
    handleScanResult({ data }: QrScanner.ScanResult) {
      try {
        const object = JSON.parse(data)
        if (!validateQrCode(object)) throw new Error('QR Code is not a Heseya Code')
        console.log('Scan result:', object) // TODO: redirect to order
      } catch {}
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
