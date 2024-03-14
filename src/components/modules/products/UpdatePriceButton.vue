<template>
  <icon-button :disabled="loading" @click="onClick">
    <template #icon>
      <i v-if="!loading" class="bx bx-cloud-upload"></i>
      <i v-else class="bx bx-loader-circle"></i>
    </template>
    {{ $t('uploadText') }}
  </icon-button>
</template>

<i18n lang="json">
{
  "en": {
    "uploadText": "Import prices from XML/CSV file",
    "successMessage": "Prices have been imported"
  },
  "pl": {
    "uploadText": "Zaimportuj ceny z pliku XML/CSV",
    "successMessage": "Ceny zostały zaimportowane"
  }
}
</i18n>

<script lang="ts">
import { sdk } from '@/api'
import { formatApiNotificationError } from '@/utils/errors'
import { defineComponent } from 'vue'
export default defineComponent({
  data: () => ({ loading: false }),

  methods: {
    createUploadInput() {
      const el = document.createElement('input')
      el.type = 'file'
      el.accept = '.xml,.csv'
      el.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) this.onUpload(file)
      }
      return el
    },

    onClick() {
      const el = this.createUploadInput()
      el.click()
    },

    async onUpload(file: File) {
      this.loading = true
      try {
        await sdk.Products.importPrices(file)
        this.$toast.success(this.$t('successMessage') as string)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.loading = false
    },
  },
})
</script>
