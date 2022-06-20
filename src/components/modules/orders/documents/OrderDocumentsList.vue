<template>
  <div class="order-documents">
    <div class="order-documents__header">
      <span class="order-documents__title order-title">{{ $t('title') }}</span>
      <div class="order-documents__buttons">
        <icon-button type="primary" @click="isUploadModalOpen = true">
          {{ $t('addFile') }} <template #icon> <i class="bx bx-plus"></i> </template>
        </icon-button>
      </div>
    </div>

    <div v-if="documents.length" class="order-documents__list">
      <OrderDocument v-for="doc in documents" :key="doc.id" :document="doc" :order-id="orderId" />
    </div>

    <empty v-else>{{ $t('empty') }}</empty>

    <a-modal v-model="isUploadModalOpen" width="600px" :title="$t('modalTitle')" :footer="null">
      <modal-form>
        <DocumentOrderForm :order-id="orderId" @close="isUploadModalOpen = false" />
      </modal-form>
    </a-modal>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Dokumenty zamówienia",
    "addFile": "Dodaj plik",
    "modalTitle": "Dodaj dokument do zamówienia",
    "empty": "Brak dokumentów"
  },
  "en": {
    "title": "Order documents",
    "addFile": "Add file",
    "modalTitle": "Add document to order",
    "empty": "No documents"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { OrderDocument } from '@heseya/store-core'

import OrderDocumentComponent from './OrderDocument.vue'
import DocumentOrderForm from './DocumentOrderForm.vue'
import Empty from '@/components/layout/Empty.vue'
import ModalForm from '@/components/form/ModalForm.vue'

import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  components: {
    OrderDocument: OrderDocumentComponent,
    Empty,
    ModalForm,
    DocumentOrderForm,
  },
  props: {
    orderId: {
      type: String,
      required: true,
    } as Vue.PropOptions<UUID>,
    documents: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<OrderDocument[]>,
  },
  data: () => ({
    isUploadModalOpen: false,
  }),
})
</script>

<style lang="scss" scoped>
.order-documents {
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
}
</style>
