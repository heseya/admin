<template>
  <div class="order-product-urls">
    <div class="order-product-urls__header">
      <h3 class="order-product-urls__title">
        {{ $t('title') }} <span class="gray-text">{{ product.product.name }}</span> &nbsp;

        <tag v-if="product.is_delivered" type="success" small>{{ $t('delivered') }}</tag>
        <tag v-else type="error" small>{{ $t('notDelivered') }}</tag>
      </h3>

      <icon-button class="order-product-urls__add-btn" @click="createNewUrl">
        <template #icon> <i class="bx bx-plus"></i> </template>
        {{ $t('addUrlButton') }}
      </icon-button>
    </div>

    <cms-table
      v-if="product.urls.length"
      class="order-product-urls__table"
      :value="product.urls"
      :config="tableConfig"
    >
      <template #item="{ item: url }">
        <cms-table-row :key="url.id" :item="url" no-hover :headers="tableConfig.headers">
          <template #url>
            <a
              :href="url.url"
              target="_blank"
              class="order-product-urls__url"
              @click="openUrl(url.url)"
            >
              {{ url.url }}
            </a>
          </template>

          <template #action>
            <div class="flex">
              <icon-button size="small" @click="editUrl(url)">
                <template #icon> <i class="bx bx-edit"></i> </template>
              </icon-button>

              <pop-confirm
                :title="$t('delete.confirmText').toString()"
                :ok-text="$t('common.delete').toString()"
                :cancel-text="$t('common.cancel').toString()"
                @confirm="removeUrl(url)"
              >
                <icon-button size="small" type="danger">
                  <template #icon> <i class="bx bx-trash"></i> </template>
                </icon-button>
              </pop-confirm>
            </div>
          </template>
        </cms-table-row>
      </template>
    </cms-table>

    <empty v-if="!product.urls.length"> {{ $t('emptyMessage') }} </empty>

    <pop-confirm
      v-if="product.urls.length"
      :title="$t('send.confirmText').toString()"
      :ok-text="$t('send.btn').toString()"
      ok-color="primary"
      :cancel-text="$t('common.cancel').toString()"
      @confirm="sendProductViaMail"
    >
      <AppButton :loading="isLoading" class="order-product-urls__btn" type="primary">
        {{ $t('send.title') }}
      </AppButton>
    </pop-confirm>

    <a-modal
      :visible="isFormModalActive"
      width="600px"
      :footer="null"
      @cancel="isFormModalActive = false"
    >
      <order-product-url-form
        :key="editedUrl ? editedUrl.id : 'new'"
        :edited-url="editedUrl"
        :order-id="orderId"
        :product-id="product.id"
        @close="isFormModalActive = false"
      />
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Linki do produktu",
    "delivered": "Dostarczono",
    "notDelivered": "Nie dostarczono",
    "addUrlButton": "Dodaj link",
    "emptyMessage": "Brak linków do produktu",
    "send": {
      "title": "Wyślij maila do klienta z linkami do pobrania produktów",
      "confirmText": "Czy na pewno chcesz wysłać linki do pobrania produktów do klienta?",
      "messageSuccess": "Linki do pobrania produktów zostały wysłane na adres email klienta",
      "messageError": "Wystąpił błąd podczas wysyłania maila z linkami do pobrania produktów",
      "btn": "Wyślij"
    },
    "delete": {
      "confirmText": "Czy na pewno chcesz usunąć ten link?",
      "messageSuccess": "Link został usunięty",
      "messageError": "Wystąpił błąd podczas usuwania linku"
    }
  },
  "en": {
    "title": "Product links of",
    "delivered": "Delivered",
    "notDelivered": "Not delivered",
    "addUrlButton": "Add link",
    "emptyMessage": "No product links",
    "send": {
      "title": "Send email to customer with links to download products",
      "confirmText": "Are you sure you want to send links to download products to the customer?",
      "messageSuccess": "Links to download products have been sent to the customer's email address",
      "messageError": "An error occurred while sending an email with links to download products",
      "btn": "Send"
    },
    "delete": {
      "confirmText": "Are you sure you want to delete this link?",
      "messageSuccess": "Link has been deleted",
      "messageError": "An error occurred while deleting the link"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { OrderProduct, OrderProductUrl } from '@heseya/store-core'

import { sdk } from '@/api'

import { TableConfig } from '@/interfaces/CmsTable'

import CmsTable from '@/components/cms/CmsTable.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import OrderProductUrlForm from './OrderProductUrlForm.vue'
import Empty from '@/components/layout/Empty.vue'

export default defineComponent({
  components: { CmsTable, CmsTableRow, PopConfirm, OrderProductUrlForm, Empty },
  props: {
    product: {
      type: Object as PropType<OrderProduct>,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isLoading: false,
    isFormModalActive: false,
    editedUrl: null as OrderProductUrl | null,
  }),

  computed: {
    tableConfig(): TableConfig<OrderProductUrl> {
      return {
        headers: [
          {
            key: 'name',
            label: this.$t('common.form.name') as string,
            render: (v: string) => v.toUpperCase(),
          },
          {
            key: 'url',
            label: this.$t('common.form.slug') as string,
            width: '3fr',
          },
          {
            key: 'action',
            label: '',
            width: '90px',
          },
        ],
      }
    },
  },

  methods: {
    async sendProductViaMail() {
      this.isLoading = true
      try {
        await sdk.Orders.sendProducts(this.orderId)
        this.$toast.success(this.$t('send.messageSuccess') as string)
      } catch {
        this.$toast.error(this.$t('send.messageError') as string)
      }
      this.isLoading = false
    },

    createNewUrl() {
      this.editedUrl = null
      this.isFormModalActive = true
    },
    editUrl(url: OrderProductUrl) {
      this.editedUrl = url
      this.isFormModalActive = true
    },

    async removeUrl(url: OrderProductUrl) {
      const success = await this.$accessor.orders.updateOrderProductUrls({
        orderId: this.orderId,
        productId: this.product.id,
        urls: {
          [url.name]: null,
        },
      })

      if (success) this.$toast.success(this.$t('delete.messageSuccess') as string)
      else this.$toast.error(this.$t('delete.messageError') as string)
    },

    openUrl(url: string) {
      window.open(url, '_blank')
    },
  },
})
</script>

<style lang="scss" scoped>
.order-product-urls {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__add-btn {
    white-space: nowrap;
  }

  &__btn {
    margin-top: 16px;
    align-self: center;
  }

  &__url {
    max-width: 430px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
