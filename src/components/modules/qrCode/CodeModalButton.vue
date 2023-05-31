<template>
  <div v-if="areExperimentalQrCodesEnabled">
    <icon-button @click="isQrCodeVisible = true">
      <template #icon>
        <i class="bx bx-qr"></i>
      </template>
      {{ $t('openQrCode') }}
    </icon-button>

    <code-modal
      :visible="isQrCodeVisible"
      :type="type"
      :body="body"
      :size="size"
      @close="isQrCodeVisible = false"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "openQrCode": "Otwórz kod QR"
  },
  "en": {
    "openQrCode": "Open QR code"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'

import { QrCodeObject } from '@/interfaces/QrCode'
import { EXPERIMENTAL_FLAGS } from '@/consts/featureFlags'

import CodeModal from './CodeModal.vue'

export default defineComponent({
  components: { CodeModal },
  props: {
    size: { type: Number, default: 250 },
    type: { type: String, required: true } as PropOptions<QrCodeObject>,
    body: { type: Object, required: true } as PropOptions<Record<string, any>>,
  },

  data: () => ({
    isQrCodeVisible: false,
  }),

  computed: {
    areExperimentalQrCodesEnabled(): boolean {
      return this.$accessor.config.env[EXPERIMENTAL_FLAGS.QrCodes] === '1'
    },
  },
})
</script>
