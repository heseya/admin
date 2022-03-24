<template>
  <div>
    <PaginatedList :title="$t('title')" store-key="coupons" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Coupons.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: discount }">
        <cms-table-row
          :key="discount.id"
          :item="discount"
          :headers="tableConfig.headers"
          @click="openModal(discount.id)"
        >
          <template #code>
            <b>{{ discount.code }}</b>
          </template>
          <template #description="{ rawValue }">
            <small>{{ rawValue || '-' }}</small>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <CouponForm v-model="editedItem" :disabled="!canModify" />

        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Coupons.Remove"
              :title="$t('deleteText')"
              :ok-text="$t('common.delete')"
              :cancel-text="$t('common.cancel')"
              @confirm="deleteItem"
            >
              <app-button v-if="editedItem.id" type="danger">{{ $t('common.delete') }}</app-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Kody rabatowe",
    "add": "Dodaj kod rabatowy",
    "editTitle": "Edycja kodu rabatowego",
    "newTitle": "Nowy kod rabatowy",
    "deleteText": "Czy na pewno chcesz usunąć ten kod rabatowy?",
    "from": "z",
    "table": {
      "code": "Kod",
      "discount": "Rabat",
      "used": "Wykorzystano",
      "startsAt": "Ważny od",
      "expiresAt": "Ważny do"
    }
  },
  "en": {
    "title": "Discount codes",
    "add": "Add discount code",
    "editTitle": "Edit discount code",
    "newTitle": "New discount code",
    "deleteText": "Are you sure you want to delete this discount code?",
    "from": "from",
    "table": {
      "code": "Code",
      "discount": "Discount",
      "used": "Used",
      "startsAt": "Valid from",
      "expiresAt": "Valid to"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import PaginatedList from '@/components/PaginatedList.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import CouponForm from '@/components/modules/coupons/Form.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

import { Coupon } from '@/interfaces/SalesAndCoupons'
import { DiscountCode } from '@/interfaces/DiscountCode'
import { UUID } from '@/interfaces/UUID'

import { formatCurrency } from '@/utils/currency'
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
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    CouponForm,
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
      return this.$can(this.editedItem.id ? this.$p.Coupons.Edit : this.$p.Coupons.Add)
    },
    tableConfig(): TableConfig<Coupon> {
      return {
        rowOnClick: (item) => this.openModal(item.id),
        headers: [
          { key: 'code', label: this.$t('table.code') as string, width: '0.5fr' },
          { key: 'name', label: this.$t('common.form.name') as string, width: '0.5fr' },
          {
            key: 'description',
            label: this.$t('common.form.description') as string,
          },
          { key: 'uses', label: this.$t('table.used') as string, width: '0.5fr' },
        ],
      }
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.currency)
    },
    openModal(id?: UUID) {
      if (!this.$verboseCan(this.$p.Coupons.ShowDetails)) return
      this.isModalActive = true
      if (id) {
        const item = this.$accessor.coupons.getFromListById(id)
        this.editedItem = {
          ...(item || {}),
        } as any // TODO: temporary
      } else {
        this.editedItem = {
          ...EMPTY_DISCOUNT_CODE,
        }
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.coupons.update({
          id: this.editedItem.id,
          item: this.editedItem as any, // TODO: temporary
        })
      } else {
        await this.$accessor.coupons.add(this.editedItem as any) // TODO: temporary
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.coupons.remove(this.editedItem.id)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>
