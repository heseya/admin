<template>
  <div class="order-document">
    <div class="order-document__name">{{ document.name || $t('notnamed') }}</div>
    <div class="order-document__type">{{ $t(`orderDocumentsTypes.${document.type}`) }}</div>

    <a-dropdown :trigger="['click']" class="order-document__menu">
      <button class="order-document__btn" :aria-label="$t('openMenu')">
        <i class="bx bx-dots-vertical-rounded"></i>
      </button>

      <template #overlay>
        <a-menu>
          <a-menu-item @click="download"> {{ $t('downloadBtn') }} </a-menu-item>
          <a-menu-item @click="sendToClient"> {{ $t('sendBtn') }} </a-menu-item>
          <a-menu-item @click="deleteFile"> {{ $t('deleteBtn') }} </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "notnamed": "Nie nazwany plik",
    "openMenu": "Otwórz menu",
    "sendBtn": "Wyślij do klienta",
    "sendConfirmText": "Czy na pewno chcesz wysłać dokument do klienta?",
    "sendSuccess": "Dokument został wysłany do klienta",
    "downloadBtn": "Pobierz plik",
    "downloadError": "Wystąpił błąd podczas pobierania pliku, spróbuj ponownie później.",
    "deleteBtn": "Usuń dokument",
    "deleteConfirmText": "Czy na pewno chcesz usunąć ten dokument?",
    "deleteSuccess": "Dokument został usunięty"
  },
  "en": {
    "notnamed": "Not named file",
    "openMenu": "Open menu",
    "sendBtn": "Send to the client",
    "sendConfirmText": "Are you sure you want to send the document to the client?",
    "sendSuccess": "Document was sent to the client",
    "downloadBtn": "Download file",
    "downloadError": "An error occurred while downloading the file, try again later.",
    "deleteBtn": "Delete document",
    "deleteConfirmText": "Are you sure you want to delete this document?",
    "deleteSuccess": "Document was deleted"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { OrderDocument } from '@heseya/store-core'

export default Vue.extend({
  props: {
    orderId: {
      type: String,
      required: true,
    },
    document: {
      type: Object,
      required: true,
    } as Vue.PropOptions<OrderDocument>,
  },
  methods: {
    async download() {
      const file = await this.$accessor.orders.getOrderDocument({
        orderId: this.orderId,
        documentId: this.document.id,
      })

      if (!file) {
        this.$toast.error(this.$t('downloadError') as string)
        return
      }

      const url = window.URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = `${this.document.name}.pdf`
      a.click()
    },

    sendToClient() {
      this.$confirm({
        title: this.$t('sendConfirmText') as string,
        okText: this.$t('sendBtn') as string,
        cancelText: this.$t('common.cancel') as string,
        onOk: async () => {
          const success = await this.$accessor.orders.sendOrderDocuments({
            orderId: this.orderId,
            documentIds: [this.document.id],
          })
          if (success) this.$toast.success(this.$t('sendSuccess') as string)
        },
      })
    },

    deleteFile() {
      this.$confirm({
        title: this.$t('deleteConfirmText') as string,
        okText: this.$t('deleteBtn') as string,
        cancelText: this.$t('common.cancel') as string,
        onOk: async () => {
          const success = await this.$accessor.orders.removeOrderDocument({
            orderId: this.orderId,
            documentId: this.document.id,
          })
          if (success) this.$toast.success(this.$t('deleteSuccess') as string)
        },
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.order-document {
  display: grid;
  grid-template-columns: 1fr auto 25px;
  grid-gap: 4px;
  padding: 10px;
  background-color: #f7f7f8;
  border-radius: 8px;

  &:not(:last-of-type) {
    margin-bottom: 8px;
  }

  &__name {
    font-weight: 600;
  }

  &__type {
    color: var(--gray-color-600);
    font-weight: 300;
  }

  &__btn {
    all: unset;
    display: block;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #fff;
    }
  }
}
</style>
