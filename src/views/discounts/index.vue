<template>
  <div>
    <PaginatedList title="Kody rabatowe" store-key="discounts" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Discounts.Add" @click="openModal()">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj kod rabatowy
        </icon-button>
      </template>

      <template #default="{ item: discount }">
        <cms-table-row
          :item="discount"
          :headers="tableConfig.headers"
          @click="openModal(discount.id)"
        >
          <template #code>
            <b>{{ discount.code }}</b>
            <small v-if="discount.description">&nbsp;({{ discount.description }})</small>
          </template>
          <template #discount="{ rawValue }">
            -{{ discount.type === 0 ? `${rawValue}%` : formatCurrency(rawValue) }}
          </template>
          <template #uses> {{ discount.uses }} z {{ discount.max_uses }} </template>
        </cms-table-row>
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

import PaginatedList from '@/components/PaginatedList.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import DiscountForm from '@/components/modules/discounts/Form.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

import { DiscountCode } from '@/interfaces/DiscountCode'
import { UUID } from '@/interfaces/UUID'

import { formatCurrency } from '@/utils/currency'
import { DATETIME_FORMAT, formatDate, formatUTC } from '@/utils/dates'
import { TableConfig } from '@/interfaces/CmsTable'

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
    DiscountForm,
    ValidationObserver,
    PaginatedList,
    PopConfirm,
    CmsTableRow,
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
    tableConfig(): TableConfig<DiscountCode> {
      return {
        rowOnClick: (item) => this.openModal(item.id),
        headers: [
          { key: 'code', label: 'Kod' },
          { key: 'discount', label: 'Rabat', width: '0.5fr' },
          { key: 'uses', label: 'Wykorzystano', width: '0.5fr' },
          {
            key: 'starts_at',
            label: 'Ważny od',
            render: (v) => (v ? formatDate(v) : '-'),
            width: '0.5fr',
          },
          {
            key: 'expires_at',
            label: 'Ważny do',
            render: (v) => (v ? formatDate(v) : '-'),
            width: '0.5fr',
          },
        ],
      }
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
