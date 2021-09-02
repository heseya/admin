<template>
  <div>
    <top-nav :title="`Zamówienie ${order.code}`" :subtitle="`z dnia ${formattedDate}`">
      <a :href="`https://***REMOVED***.eu/payment/${order.code}`" target="_blank">
        <vs-button color="dark" icon>
          <i class="bx bxs-dollar-circle"></i>
        </vs-button>
      </a>
      <vs-button color="dark" icon @click="downloadAudits">
        <i class="bx bx-history"></i>
      </vs-button>
    </top-nav>

    <div class="order">
      <div>
        <card>
          <div class="flex-column">
            <h2 class="section-title">Koszyk</h2>
            <app-cart-item v-for="item in order.products" :key="item.id" :item="item" />
            <div class="cart-item">
              <img class="cart-item__cover" src="/img/delivery.svg" />
              <div class="cart-item__content">
                <span>Dostawa {{ order.shipping_method && order.shipping_method.name }}</span>
              </div>
              <span class="cart-item__price">{{ order.shipping_price }} {{ currency }}</span>
            </div>
            <div class="cart-total">
              <div v-for="discount in order.discounts" :key="discount.id">
                Rabat {{ discount.code }}:
                <b>- {{ discount.discount }} {{ discount.type === 0 ? '%' : currency }}</b>
              </div>
              Łącznie: <b>{{ order.summary }} {{ currency }}</b>
            </div>
          </div>
        </card>

        <card>
          <div class="flex-column send-package">
            <h2 class="section-title">Wyślij przesyłkę</h2>
            <div v-if="!shippingNumber" class="flex">
              <vs-select
                :key="packageTemplates.length"
                v-model="packageTemplateId"
                label="Szablon przesyłki"
                placeholder="-- Wybierz szablon --"
              >
                <vs-option
                  v-for="template in packageTemplates"
                  :key="template.id"
                  :label="template.name"
                  :value="template.id"
                >
                  {{ template.name }}
                </vs-option>
              </vs-select>
              <vs-button color="dark" @click="createPackage">Utwórz&nbsp;przesyłkę</vs-button>
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
            <vs-select
              :key="statuses.length"
              v-model="status"
              :loading="isLoading"
              :disabled="!$can($p.Orders.EditStatus)"
            >
              <vs-option
                v-for="status in statuses"
                :key="status.id"
                :label="status.name"
                :value="status.id"
              >
                {{ status.name }}
              </vs-option>
            </vs-select>
          </template>
          <br />
          <h2 class="section-title">Próby płatności</h2>
          <div v-for="payment in order.payments" :key="payment.id" class="payment-method">
            <i v-if="payment.payed" class="bx bxs-check-circle payment-method__success"></i>
            <i v-if="!payment.payed" class="bx bxs-x-circle payment-method__failed"></i>
            <span class="payment-method__name">{{ payment.method }}</span>
            <span class="payment-method__amount">({{ payment.amount }} {{ currency }})</span>
          </div>
        </card>
        <card class="comment">
          <template>
            <h2 class="section-title">Komentarz</h2>
            <vs-button
              v-can="$p.Orders.Edit"
              size="tiny"
              dark
              transparent
              class="comment__edit"
              @click="editComment"
            >
              <i class="bx bxs-pencil"></i>
            </vs-button>
            <span class="comment__content">
              {{ order.comment || 'Brak komentarza do zamówienia' }}
            </span>
          </template>
        </card>
        <card>
          <h2 class="section-title">E-mail</h2>
          <div class="email">
            <vs-button
              v-can="$p.Orders.Edit"
              size="tiny"
              dark
              transparent
              class="email__edit"
              @click="editEmail"
            >
              <i class="bx bxs-pencil"></i>
            </vs-button>
            <a :href="`mailto:${order.email}`" class="email__name">{{ order.email }}</a>
          </div>
          <br />
          <h2 class="section-title">Adres dostawy</h2>
          <app-address :address="order.delivery_address" hide-remove @edit="editDeliveryAddress" />
        </card>
        <card>
          <template>
            <h2 class="section-title">Adres rozliczeniowy</h2>
            <app-address
              :address="order.invoice_address"
              @edit="editInvoiceAddress"
              @remove="removeInvoiceAddress"
            />
          </template>
        </card>
      </div>
    </div>

    <vs-dialog v-model="isModalActive" width="800px" not-center>
      <template #header>
        <h4>Edytuj {{ modalFormTitle }}</h4>
      </template>
      <modal-form>
        <partial-update-form v-model="form" @save="saveForm" />
      </modal-form>
    </vs-dialog>
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

import { getRelativeDate, formatDate } from '@/utils/utils'
import { createPackage } from '@/services/createPackage'
import { formatApiError } from '@/utils/errors'
import { Order, OrderStatus } from '@/interfaces/Order'
import { PackageTemplate } from '@/interfaces/PackageTemplate'
import { downloadJsonAsFile } from '@/utils/download'

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
  components: {
    TopNav,
    Card,
    appAddress: Address,
    appCartItem: CartItem,
    ModalForm,
    PartialUpdateForm,
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
    currency(): string {
      return this.$accessor.currency
    },
    error(): any {
      return this.$accessor.orders.getError
    },
    order(): Order {
      return this.$accessor.orders.getSelected
    },
    statuses(): OrderStatus[] {
      return this.$accessor.statuses.getData
    },
    packageTemplates(): PackageTemplate[] {
      return this.$accessor.packageTemplates.getData
    },
    relativeOrderedDate(): string {
      return this.order.created_at && getRelativeDate(this.order.created_at)
    },
    formattedDate(): string {
      return this.order.created_at && formatDate(this.order.created_at)
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
      if (error) this.$vs.notification({ color: 'danger', ...formatApiError(error) })
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
    async setStatus(newStatus: OrderStatus) {
      this.isLoading = true

      // @ts-ignore // TODO: fix extended store actions typings
      const success = await this.$accessor.orders.changeStatus({
        orderId: this.order.id,
        statusId: newStatus,
      })

      if (success) {
        this.$vs.notification({
          color: 'success',
          title: 'Status zamówienia został zmieniony',
        })
      }

      this.isLoading = false
    },
    async createPackage() {
      if (!this.packageTemplateId) return
      this.$accessor.startLoading()
      const { success, shippingNumber, error } = await createPackage(
        this.order.id,
        this.packageTemplateId,
      )

      if (success) {
        this.shippingNumber = shippingNumber
        this.$vs.notification({
          color: 'success',
          title: 'Przesyłka utworzona poprawnie',
        })
      } else {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
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
      this.$vs.notification({
        color: 'success',
        title: 'Zamówienie zostało zaktualizowane',
      })
      this.$accessor.stopLoading()
    },

    async downloadAudits() {
      const data = await this.$accessor.orders.fetchAudits(this.order.id)
      downloadJsonAsFile(data, 'orders-history')
    },
  },
})
</script>

<style lang="scss" scoped>
.vs-select,
.vs-select-content {
  max-width: 100%;
  width: 100%;
}

.section-title {
  font-family: $font-sec;
  font-weight: 300;
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
  color: #444;
  position: relative;

  &__edit {
    position: absolute;
    bottom: calc(100% + 4px);
    right: 0;
  }

  &__name {
    font-size: 1em;
    margin-bottom: 3px;
    color: #111;
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
  font-family: $font-sec;
  font-size: 1.2em;
  margin-top: auto;
}

.order {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-gap: 32px;

  @media screen and (max-width: 780px) {
    grid-template-columns: 1fr;
  }
}

.payment-method {
  display: flex;
  align-items: center;
  margin: 3px 0;

  &__name {
    font-family: $font-main;
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
    color: #fc4757;
  }

  &__success {
    color: #46ca3a;
  }
}

.send-package {
  .section-title {
    margin-bottom: 24px;
  }

  .vs-button {
    white-space: nowrap;
    flex-shrink: 0;
  }
}
</style>
