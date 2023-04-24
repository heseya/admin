<template>
  <LayoutAccordion :title="$t('title')">
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

      <div class="product-attachments__content">
        <list-item v-for="attachment in attachments" :key="attachment.id" class="attachment">
          <a :href="attachment.media.url" target="_blank">
            {{ attachment.name }}
            <i class="bx bx-link-external"></i>
          </a>

          <template #action>
            <div class="attachment__actions">
              <icon-button size="small" :disabled="disabled" @click="openEditModal(attachment)">
                <template #icon>
                  <i class="bx bx-edit"></i>
                </template>
              </icon-button>

              <pop-confirm
                :disabled="disabled"
                :title="$t('deleteText')"
                :ok-text="$t('common.delete')"
                :cancel-text="$t('common.cancel')"
                @confirm="removeAttachment(attachment)"
              >
                <icon-button size="small" type="danger" :disabled="disabled">
                  <template #icon>
                    <i class="bx bx-trash"></i>
                  </template>
                </icon-button>
              </pop-confirm>
            </div>
          </template>
        </list-item>
      </div>

      <a-modal
        v-model="isModalOpen"
        width="800px"
        :title="form && 'id' in form ? $t('editTitle') : $t('addTitle')"
        :footer="null"
      >
        <AttachmentForm
          v-if="form"
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
    "onUpdatedText": "Attachment has been updated"
  },
  "pl": {
    "title": "Załączniki",
    "addTitle": "Dodaj załącznik",
    "editTitle": "Edytuj załącznik",
    "deleteText": "Czy na pewno chcesz usunąć ten załącznik?",
    "onDeletedText": "Załącznik został usunięty",
    "onCreatedText": "Załącznik został dodany do produktu",
    "onUpdatedText": "Załącznik został zaktualizowany"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
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
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'

const EMPTY_ATTACHMENT: ProductAttachmentCreateDto = {
  name: '',
  description: '',
  type: CdnMediaAttachmentType.Other,
  visibility: CdnMediaAttachmentVisiblity.Public,
  media_id: '',
}

export default Vue.extend({
  components: { LayoutAccordion, AttachmentForm, ListItem, PopConfirm },
  props: {
    product: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Product>,
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

.attachment {
  background-color: #fff;

  &__actions {
    display: flex;
  }
}
</style>
