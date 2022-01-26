<template>
  <div class="narrower-page">
    <top-nav :title="`Zamówienie ${order.code}`" :subtitle="`z dnia ${formattedDate}`">
      <audits-modal :id="order.id" model="orders" />
      <a v-if="storefrontPaymentUrl" :href="`${storefrontPaymentUrl}${order.code}`" target="_blank">
        <icon-button>
          <template #icon>
            <i class="bx bxs-dollar-circle"></i>
          </template>
          Przejdź do płatności
        </icon-button>
      </a>
      <pop-confirm
        v-if="order.payable"
        title="Czy na pewno chcesz ręcznie oznaczyć zamówienie jako opłacone? (Np. przelewem tradycyjnym lub gotówką)"
        ok-text="Opłać"
        ok-color="success"
        :cancel-text="$t('common.cancel')"
        @confirm="payOffline"
      >
        <icon-button>
          <template #icon>
            <i class="bx bxs-diamond"></i>
          </template>
          Opłać zamówienie
        </icon-button>
      </pop-confirm>

      <next-prev-buttons />
    </top-nav>

    <div class="order">
      <div>
        <card>
          <div class="flex-column">
            <h2 class="section-title">Koszyk</h2>
            <app-cart-item
              v-for="item in order.products"
              :key="item.id"
              :item="item"
              :discount="order.discounts[0]"
              :products-count="productsCount"
            />
            <div class="cart-item">
              <img class="cart-item__cover" src="@/assets/images/icons/delivery-icon.svg" />
              <div class="cart-item__content">
                <span>Dostawa {{ order.shipping_method && order.shipping_method.name }}</span>
              </div>
              <span class="cart-item__price">{{ formatCurrency(order.shipping_price) }}</span>
            </div>
            <div class="cart-total">
              <div v-for="discount in order.discounts" :key="discount.id">
                Rabat {{ discount.code }}:
                <b>
                  -{{
                    discount.type === 0
                      ? `${discount.discount}%`
                      : formatCurrency(discount.discount)
                  }}
                </b>
              </div>
              Łącznie: <b>{{ formatCurrency(order.summary) }}</b>
            </div>
          </div>
        </card>

        <card>
          <div class="flex-column send-package">
            <h2 class="section-title send-package__title">Wyślij przesyłkę</h2>
            <div v-if="!shippingNumber" class="send-package__content">
              <app-select
                v-model="packageTemplateId"
                label="Szablon przesyłki"
                placeholder="-- Wybierz szablon --"
                option-filter-prop="label"
              >
                <a-select-option
                  v-for="template in packageTemplates"
                  :key="template.id"
                  :label="template.name"
                >
                  {{ template.name }}
                </a-select-option>
              </app-select>
              <app-button @click="createPackage">Utwórz&nbsp;przesyłkę</app-button>
            </div>
            <small v-else>
              <i class="bx bxs-check-circle"></i> Przesyłka została już zamówiona (Numer śledzenia:
              {{ shippingNumber }})
            </small>
          </div>
        </card>
      </div>

      <div>
        <card>
          <template v-if="order.status">
            <h2 class="section-title">Status</h2>
            <app-select
              v-model="status"
              :loading="isLoading"
              option-filter-prop="label"
              :disabled="!$can($p.Orders.EditStatus)"
            >
              <a-select-option v-for="{ id, name } in statuses" :key="id" :label="name">
                {{ name }}
              </a-select-option>
            </app-select>
          </template>
          <br />
          <h2 class="section-title">
            <a-tooltip v-if="order.summary_paid > order.summary">
              <template #title>
                Zamówienie zostało nadpłacone o
                <b>{{ formatCurrency(order.summary_paid - order.summary) }}</b
                >!
                <br />
                <br />
                Klient zapłacił {{ formatCurrency(order.summary_paid) }} zamiast
                {{ formatCurrency(order.summary) }}
              </template>
              <span class="overpaid-icon"> <i class="bx bxs-error"></i> </span>
            </a-tooltip>

            Próby płatności
          </h2>
          <div v-for="payment in order.payments" :key="payment.id" class="payment-method">
            <i v-if="payment.paid" class="bx bxs-check-circle payment-method__success"></i>
            <i v-if="!payment.paid" class="bx bxs-x-circle payment-method__failed"></i>
            <span class="payment-method__name">{{ payment.method }}</span>
            <span class="payment-method__amount">({{ formatCurrency(payment.amount) }})</span>
          </div>
        </card>
        <card class="comment">
          <h2 class="section-title">Komentarz</h2>
          <icon-button
            v-can="$p.Orders.Edit"
            size="small"
            type="transparent"
            class="comment__edit"
            @click="editComment"
          >
            <template #icon>
              <i class="bx bxs-pencil"></i>
            </template>
          </icon-button>
          <span class="comment__content">
            {{ order.comment || 'Brak komentarza do zamówienia' }}
          </span>
        </card>
        <card>
          <h2 class="section-title">E-mail</h2>
          <div class="email">
            <icon-button
              v-can="$p.Orders.Edit"
              size="small"
              type="transparent"
              class="email__edit"
              @click="editEmail"
            >
              <template #icon>
                <i class="bx bxs-pencil"></i>
              </template>
            </icon-button>
            <a :href="`mailto:${order.email}`" class="email__name">{{ order.email }}</a>
          </div>
          <br />
          <h2 class="section-title">Adres dostawy</h2>
          <app-address :address="order.delivery_address" hide-remove @edit="editDeliveryAddress" />
        </card>
        <card>
          <h2 class="section-title">Adres rozliczeniowy</h2>
          <app-address
            :address="order.invoice_address"
            @edit="editInvoiceAddress"
            @remove="removeInvoiceAddress"
          />
        </card>
      </div>
    </div>

    <a-modal
      v-model="isModalActive"
      width="800px"
      :footer="null"
      :title="`Edytuj ${modalFormTitle}`"
    >
      <modal-form>
        <partial-update-form v-model="form" @save="saveForm" />
      </modal-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import Address from '@/components/modules/orders/OrderAddress.vue'
import CartItem from '@/components/layout/CartItem.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PartialUpdateForm from '@/components/modules/orders/PartialUpdateForm.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import AuditsModal from '@/components/modules/audits/AuditsModal.vue'
import NextPrevButtons from '@/components/modules/orders/NextPrevButtons.vue'

import { Order, OrderStatus } from '@/interfaces/Order'
import { getRelativeDate } from '@/utils/utils'
import { formatDate } from '@/utils/dates'

import { createPackage } from '@/services/createPackage'
import { formatApiNotificationError } from '@/utils/errors'
import { PackageTemplate } from '@/interfaces/PackageTemplate'
import { formatCurrency } from '@/utils/currency'
import { api } from '@/api'

const DEFAULT_FORM = {
  address: '',
  city: '',
  country: 'PL',
  country_name: '',
  name: '',
  phone: '',
  vat: '',
  zip: '',
}

export default Vue.extend({
  metaInfo(): any {
    return { title: `Zamówienie ${this.order?.code}` }
  },
  components: {
    TopNav,
    Card,
    appAddress: Address,
    appCartItem: CartItem,
    ModalForm,
    PartialUpdateForm,
    PopConfirm,
    AuditsModal,
    NextPrevButtons,
  },
  data: () => ({
    status: '',
    packageTemplateId: '',
    shippingNumber: '',
    isLoading: false,
    modalFormTitle: '',
    form: {},
    isModalActive: false,
  }),
  computed: {
    error(): any {
      return this.$accessor.orders.getError
    },
    order(): Order {
      return this.$accessor.orders.getSelected
    },
    productsCount(): number {
      return this.order.products.reduce((sum, item) => sum + item.quantity, 0)
    },
    statuses(): OrderStatus[] {
      return this.$accessor.statuses.getData
    },
    packageTemplates(): PackageTemplate[] {
      return this.$accessor.packageTemplates.getData
    },
    relativeOrderedDate(): string | null {
      return this.order.created_at && getRelativeDate(this.order.created_at, this.$i18n.locale)
    },
    formattedDate(): string | null {
      return this.order.created_at && formatDate(this.order.created_at)
    },
    storefrontPaymentUrl(): string | undefined {
      return this.$accessor.env.storefront_payment_url || undefined
    },
  },
  watch: {
    order(order: Order) {
      this.status = order?.status?.id
      this.shippingNumber = order.shipping_number || ''
    },
    status(status: OrderStatus, prevStatus: OrderStatus) {
      if (!prevStatus) return
      this.setStatus(status)
    },
    error(error) {
      if (error) this.$toast.error(formatApiNotificationError(error))
    },
  },
  async created() {
    this.$accessor.startLoading()
    await Promise.all([
      this.$accessor.orders.get(this.$route.params.id),
      this.$accessor.statuses.fetch(),
      this.$accessor.packageTemplates.fetch(),
    ])
    this.$accessor.stopLoading()
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.currency)
    },
    async setStatus(newStatus: OrderStatus) {
      this.isLoading = true

      // @ts-ignore // TODO: fix extended store actions typings
      const success = await this.$accessor.orders.changeStatus({
        orderId: this.order.id,
        statusId: newStatus,
      })

      if (success) {
        this.$toast.success('Status zamówienia został zmieniony')
      }

      this.isLoading = false
    },
    async createPackage() {
      if (!this.packageTemplateId) return
      this.$accessor.startLoading()
      const res = await createPackage(this.order.id, this.packageTemplateId)

      if (res.success) {
        this.shippingNumber = res.shippingNumber
        this.$toast.success('Przesyłka utworzona poprawnie')
      } else {
        this.$toast.error(formatApiNotificationError(res.error))
      }

      this.$accessor.stopLoading()
    },
    editComment() {
      this.isModalActive = true
      this.modalFormTitle = 'komentarz do zamówienia'
      this.form = {
        comment: this.order.comment,
      }
    },
    editEmail() {
      this.isModalActive = true
      this.modalFormTitle = 'adres e-mail'
      this.form = {
        email: this.order.email,
      }
    },
    editDeliveryAddress() {
      this.isModalActive = true
      this.modalFormTitle = 'adres dostawy'
      this.form = {
        delivery_address: {
          ...this.order.delivery_address,
        },
      }
    },
    editInvoiceAddress() {
      this.isModalActive = true
      this.modalFormTitle = 'adres rozliczeniowy'
      this.form = {
        invoice_address: {
          ...(this.order.invoice_address || DEFAULT_FORM),
        },
      }
    },
    removeInvoiceAddress() {
      this.form = { invoice_address: null }
      this.saveForm()
    },
    async saveForm() {
      this.$accessor.startLoading()
      await this.$accessor.orders.update({ id: this.order.id, item: this.form })
      this.isModalActive = false
      this.$toast.success('Zamówienie zostało zaktualizowane')
      this.$accessor.stopLoading()
    },

    async payOffline() {
      this.$accessor.startLoading()
      try {
        await api.post(`/orders/${this.order.code}/pay/offline`)
        await this.$accessor.orders.get(this.$route.params.id)
        this.$toast.success('Zamówienie zostało opłacone')
      } catch {
        this.$toast.error('Nie udało się opłacić zamówienia')
      }

      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
.section-title {
  font-weight: 600;
  margin: 0;
  font-size: 1.5em;
  display: flex;
  align-items: center;

  .bx {
    font-size: 0.9em;
    margin-right: 4px;
  }
}

.email {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  color: #444444;
  position: relative;

  &__edit {
    position: absolute;
    bottom: calc(100% + 4px);
    right: 0;
  }

  &__name {
    font-size: 1em;
    margin-bottom: 3px;
    color: #111111;
  }
}

.comment {
  position: relative;

  &__content {
    display: block;
    margin-top: 10px;
    font-size: 0.9em;
  }

  &__edit {
    position: absolute;
    top: 16px;
    right: 20px;
  }
}

.cart-total {
  font-weight: 600;
  font-size: 1.2em;
  margin-top: auto;
}

.order {
  display: grid;
  grid-template-columns: 1fr 400px;
  grid-gap: 32px;

  @media screen and (max-width: 780px) {
    grid-template-columns: 1fr;
  }

  .overpaid-icon {
    display: flex;
    justify-content: center;
    color: $red-color-500;
    margin-right: 5px;
  }
}

.payment-method {
  display: flex;
  align-items: center;
  margin: 3px 0;

  &__name {
    font-family: $primaryFont;
    margin-left: 10px;
    margin-right: 4px;
    text-transform: capitalize;
  }

  &__amount {
    font-size: 0.7em;
    line-height: 1rem;
  }

  .bx {
    font-size: 1.3em;
    margin-top: 1px;
  }

  &__failed {
    color: $red-color-400;
  }

  &__success {
    color: $green-color-400;
  }
}

.send-package {
  &__title {
    margin-bottom: 8px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media ($viewport-8) {
      flex-direction: row;
    }

    > *:first-child {
      margin-right: 8px;
    }
  }
}
</style>
