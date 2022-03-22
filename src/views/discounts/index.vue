<template>
  <div>
    <PaginatedList :title="$t('title')" store-key="discounts" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Discounts.Add" @click="openModal()">
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
            <small v-if="discount.description">&nbsp;({{ discount.description }})</small>
          </template>
          <template #discount="{ rawValue }">
            -{{ discount.type === 0 ? `${rawValue}%` : formatCurrency(rawValue) }}
          </template>
          <template #uses> {{ discount.uses }} {{ $t('from') }} {{ discount.max_uses }} </template>
        </cms-table-row>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <DiscountForm v-model="editedItem" :disabled="!canModify" />

        <template v-if="selectedItem">
          <hr />
          <MetadataForm
            ref="publicMeta"
            :value="selectedItem.metadata"
            :disabled="!canModify"
            model="discounts"
          />
          <MetadataForm
            v-if="selectedItem.metadata_private"
            ref="privateMeta"
            :value="selectedItem.metadata_private"
            :disabled="!canModify"
            is-private
            model="discounts"
          />
        </template>

        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Discounts.Remove"
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
import DiscountForm from '@/components/modules/discounts/Form.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { DiscountCode, DiscountCodeDto, DiscountCodeType } from '@/interfaces/DiscountCode'
import { UUID } from '@/interfaces/UUID'

import { formatCurrency } from '@/utils/currency'
import { DATETIME_FORMAT, formatDate, formatUTC } from '@/utils/dates'
import { TableConfig } from '@/interfaces/CmsTable'

const EMPTY_DISCOUNT_CODE: DiscountCodeDto = {
  type: DiscountCodeType.Percentage,
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
    DiscountForm,
    ValidationObserver,
    PaginatedList,
    PopConfirm,
    CmsTableRow,
    MetadataForm,
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
    } as DiscountCodeDto & { id?: string },
    selectedItem: null as DiscountCode | null,
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Discounts.Edit : this.$p.Discounts.Add)
    },
    tableConfig(): TableConfig<DiscountCode> {
      return {
        rowOnClick: (item) => this.openModal(item.id),
        headers: [
          { key: 'code', label: this.$t('table.code') as string },
          { key: 'discount', label: this.$t('table.discount') as string, width: '0.5fr' },
          { key: 'uses', label: this.$t('table.used') as string, width: '0.5fr' },
          {
            key: 'starts_at',
            label: this.$t('table.startsAt') as string,
            render: (v) => formatDate(v) || '-',
            width: '0.5fr',
          },
          {
            key: 'expires_at',
            label: this.$t('table.expiresAt') as string,
            render: (v) => formatDate(v) || '-',
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
        this.selectedItem = item
        this.editedItem = {
          ...(item || {}),
          starts_at: formatDate(item.starts_at, DATETIME_FORMAT),
          expires_at: formatDate(item.expires_at, DATETIME_FORMAT),
        }
      } else {
        this.selectedItem = null
        this.editedItem = {
          ...EMPTY_DISCOUNT_CODE,
        }
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        // Metadata can be saved only after discount is created
        await this.saveMetadata(this.editedItem.id)

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
      await this.$accessor.discounts.remove(this.editedItem.id!)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },

    async saveMetadata(id: string) {
      await (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id)
      await (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id)
    },
  },
})
</script>
