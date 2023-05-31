<template>
  <a-modal :visible="visible" :width="`${size + 48}px`" :footer="null" @cancel="$emit('close')">
    <img :src="codeUrl" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'

import { QrCodeObject, QrCodePayload } from '@/interfaces/QrCode'

export default defineComponent({
  props: {
    visible: { type: Boolean, default: false },
    size: { type: Number, default: 250 },
    type: { type: String, required: true } as PropOptions<QrCodeObject>,
    body: { type: Object, required: true } as PropOptions<Record<string, any>>,
  },

  computed: {
    codeContent(): QrCodePayload {
      return {
        v: 1,
        typ: this.type,
        body: this.body,
      }
    },

    codeUrl(): string {
      return `https://api.qrserver.com/v1/create-qr-code/?size=${this.size}x${
        this.size
      }&data=${JSON.stringify(this.codeContent)}`
    },
  },
})
</script>
