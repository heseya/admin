<template>
  <div>
    <PaginatedList title="Kody rabatowe" store-key="discounts">
      <template #nav>
        <icon-button v-can="$p.Discounts.Add" @click="openModal()">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj kod rabatowy
        </icon-button>
      </template>

      <template #default="{ item: discount }">
        <list-item @click="openModal(discount.id)">
          {{ discount.code }}
          <small>
            <template v-if="discount.starts_at || discount.expires_at">
              Ważny
              <template v-if="discount.starts_at">
                od {{ formatDateTime(discount.starts_at) }}
              </template>
              <template v-if="discount.expires_at">
                do {{ formatDateTime(discount.expires_at) }}
              </template>
              <template v-if="discount.description">|</template>
            </template>
            {{ discount.description }}
          </small>

          <template #action>
            -{{ discount.type === 0 ? `${discount.discount}%` : formatCurrency(discount.discount) }}
            <small style="white-space: nowrap">
              wykorzystano {{ discount.uses }} z {{ discount.max_uses }}
            </small>
          </template>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? 'Edycja kodu rabatowego' : 'Nowy kod rabatowy'"
      >
        <DiscountForm v-model="editedItem" :disabled="!canModify" />

        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)"> Zapisz </app-button>
            <pop-confirm
              v-can="$p.Discounts.Remove"
              title="Czy na pewno chcesz usunąć ten kod?"
              ok-text="Usuń"
              cancel-text="Anuluj"
              @confirm="deleteItem"
            >
              <app-button v-if="editedItem.id" type="danger">Usuń</app-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import DiscountForm from '@/components/modules/discounts/Form.vue'

import { DiscountCode } from '@/interfaces/DiscountCode'
import { UUID } from '@/interfaces/UUID'

import { formatCurrency } from '@/utils/currency'
import { DATETIME_FORMAT, formatDate, formatUTC } from '@/utils/dates'

const EMPTY_DISCOUNT_CODE: DiscountCode = {
  id: '',
  type: 0,
  code: '',
  discount: 0.0,
  max_uses: 1,
  available: true,
  uses: 0,
  starts_at: null,
  expires_at: null,
}

export default Vue.extend({
  metaInfo: { title: 'Kody rabatowe' },
  components: {
    ListItem,
    DiscountForm,
    ValidationObserver,
    PaginatedList,
    PopConfirm,
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      ...EMPTY_DISCOUNT_CODE,
    } as DiscountCode,
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Discounts.Edit : this.$p.Discounts.Add)
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.currency)
    },
    formatDateTime(date: string) {
      return formatDate(date)
    },
    openModal(id?: UUID) {
      if (!this.$verboseCan(this.$p.Discounts.ShowDetails)) return
      this.isModalActive = true
      if (id) {
        const item = this.$accessor.discounts.getFromListById(id)
        this.editedItem = {
          ...(item || {}),
          starts_at: formatDate(item.starts_at, DATETIME_FORMAT),
          expires_at: formatDate(item.expires_at, DATETIME_FORMAT),
        }
      } else {
        this.editedItem = {
          ...EMPTY_DISCOUNT_CODE,
        }
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.discounts.update({
          id: this.editedItem.id,
          item: {
            ...this.editedItem,
            starts_at: formatUTC(this.editedItem.starts_at),
            expires_at: formatUTC(this.editedItem.expires_at),
          },
        })
      } else {
        await this.$accessor.discounts.add(this.editedItem)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.discounts.remove(this.editedItem.id)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>
