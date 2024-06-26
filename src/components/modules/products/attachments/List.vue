<template>
  <LayoutAccordion :title="$t('title').toString()">
    <div class="product-attachments">
      <icon-button
        class="product-attachments__btn"
        size="small"
        :disabled="disabled"
        @click="openAddModal"
      >
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addTitle') }}
      </icon-button>

      <Empty v-if="attachments.length === 0" class="additional-descriptions__empty">
        {{ $t('emptyText') }}
      </Empty>

      <div class="product-attachments__content">
        <editable-list-item
          v-for="attachment in attachments"
          :key="attachment.id"
          :item="attachment"
          :disabled="disabled"
          :delete-text="$t('deleteText').toString()"
          @edit="openEditModal"
          @remove="removeAttachment"
        >
          <a :href="attachment.media.url" target="_blank">
            {{ attachment.name }}
            <i class="bx bx-link-external"></i>
          </a>
        </editable-list-item>
      </div>

      <a-modal
        v-model="isModalOpen"
        width="800px"
        :title="form && 'id' in form ? $t('editTitle') : $t('addTitle')"
        :footer="null"
      >
        <AttachmentForm
          v-if="form && isModalOpen"
          v-model="form"
          :product-id="product.id"
          @created="onCreated"
          @updated="onUpdated"
        />
      </a-modal>
    </div>
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Attachments",
    "addTitle": "Add attachment",
    "editTitle": "Edit attachment",
    "deleteText": "Are you sure you want to delete this attachment?",
    "onDeletedText": "Attachment has been deleted",
    "onCreatedText": "Attachment has been created and added to product",
    "onUpdatedText": "Attachment has been updated",
    "emptyText": "No attachments added yet"
  },
  "pl": {
    "title": "Załączniki",
    "addTitle": "Dodaj załącznik",
    "editTitle": "Edytuj załącznik",
    "deleteText": "Czy na pewno chcesz usunąć ten załącznik?",
    "onDeletedText": "Załącznik został usunięty",
    "onCreatedText": "Załącznik został dodany do produktu",
    "onUpdatedText": "Załącznik został zaktualizowany",
    "emptyText": "Brak załączników"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import {
  CdnMediaAttachmentType,
  CdnMediaAttachmentVisiblity,
  Product,
  ProductAttachment,
  ProductAttachmentCreateDto,
  ProductAttachmentUpdateDto,
} from '@heseya/store-core'

import { sdk } from '@/api'
import { formatApiNotificationError } from '@/utils/errors'

import LayoutAccordion from '@/components/layout/Accordion.vue'
import AttachmentForm from '@/components/modules/products/attachments/Form.vue'
import EditableListItem from '@/components/layout/EditableListItem.vue'
import Empty from '@/components/layout/Empty.vue'

const EMPTY_ATTACHMENT: ProductAttachmentCreateDto = {
  name: '',
  description: '',
  type: CdnMediaAttachmentType.Other,
  visibility: CdnMediaAttachmentVisiblity.Public,
  media_id: '',
}

export default defineComponent({
  components: { LayoutAccordion, AttachmentForm, EditableListItem, Empty },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    attachments: [] as ProductAttachment[],
    isModalOpen: false,
    form: null as ProductAttachmentCreateDto | (ProductAttachmentUpdateDto & { id: string }) | null,
  }),

  watch: {
    'product.attachments': {
      handler() {
        this.attachments = cloneDeep(this.product.attachments) || []
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    openAddModal() {
      this.form = cloneDeep(EMPTY_ATTACHMENT)
      this.isModalOpen = true
    },

    openEditModal(attachment: ProductAttachment) {
      this.form = {
        id: attachment.id,
        name: attachment.name,
        description: attachment.description || '',
        type: attachment.type,
        visibility: attachment.visibility,
      }
      this.isModalOpen = true
    },

    onCreated(attachment: ProductAttachment) {
      this.attachments.push(attachment)
      this.isModalOpen = false
      this.$toast.success(this.$t('onCreatedText') as string)
    },

    onUpdated(attachment: ProductAttachment) {
      const index = this.attachments.findIndex((a) => a.id === attachment.id)
      this.attachments.splice(index, 1, attachment)
      this.isModalOpen = false
      this.$toast.success(this.$t('onUpdatedText') as string)
    },

    async removeAttachment(attachment: ProductAttachment) {
      try {
        // This also removes media from CDN
        await sdk.Products.Attachments.delete(this.product.id, attachment.id)

        const index = this.attachments.findIndex((a) => a.id === attachment.id)
        this.attachments.splice(index, 1)
        this.$toast.success(this.$t('onDeletedText') as string)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.product-attachments {
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;

    @media ($viewport-3) {
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    }
  }

  &__btn {
    margin-left: auto;
    margin-bottom: 8px;
  }
}
</style>
