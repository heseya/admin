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
        {{ attachments }}
      </div>

      <a-modal v-model="isModalOpen" width="800px" :title="$t('editTitle')" :footer="null">
        <AttachmentForm v-if="form" v-model="form" />
      </a-modal>
    </div>
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Attachments",
    "addTitle": "Add attachment",
    "editTitle": "Edit attachment"
  },
  "pl": {
    "title": "Załączniki",
    "addTitle": "Dodaj załącznik",
    "editTitle": "Edytuj załącznik"
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

import LayoutAccordion from '@/components/layout/Accordion.vue'
import AttachmentForm from '@/components/modules/products/attachments/Form.vue'

const EMPTY_ATTACHMENT: ProductAttachmentCreateDto = {
  name: '',
  description: '',
  type: CdnMediaAttachmentType.Other,
  visibility: CdnMediaAttachmentVisiblity.Public,
  media_id: '',
}

export default Vue.extend({
  components: { LayoutAccordion, AttachmentForm },
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
    form: null as ProductAttachmentCreateDto | ProductAttachmentUpdateDto | null,
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
      this.isModalOpen = true
      this.form = cloneDeep(EMPTY_ATTACHMENT)
    },
  },
})
</script>

<style lang="scss" scoped>
.product-attachments {
  &__btn {
    margin-left: auto;
  }
}
</style>
