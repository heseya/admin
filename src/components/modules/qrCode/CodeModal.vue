<template>
  <a-modal :visible="visible" :width="`${size + 48}px`" :footer="null" @cancel="$emit('close')">
    <img :src="codeUrl" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { QrCodeObject, QrCodePayload } from '@/interfaces/QrCode'

export default defineComponent({
  props: {
    visible: { type: Boolean, default: false },
    size: { type: Number, default: 250 },
    type: { type: String as PropType<QrCodeObject>, required: true },
    body: { type: Object as PropType<Record<string, any>>, required: true },
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
