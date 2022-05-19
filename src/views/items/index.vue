<template>
  <div>
    <PaginatedList
      :title="$t('title')"
      store-key="items"
      :filters="filters"
      :table="tableConfig"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.Items.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #filters>
        <items-filter :filters="filters" @search="makeSearch" />
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.name"
            :disabled="!canModify"
            rules="required"
            :label="$t('common.form.name')"
          />

          <validated-input
            v-model="editedItem.sku"
            :disabled="!canModify"
            rules="required"
            :label="$t('form.sku')"
          />
          <validated-input
            v-if="editedItem.id"
            v-model="editedItem.quantity"
            :disabled="!canModify"
            rules="required"
            type="number"
            :label="$t('form.quantity')"
          />

          <template v-if="selectedItem">
            <MetadataForm
              ref="publicMeta"
              :value="selectedItem.metadata"
              :disabled="!canModify"
              model="items"
            />
            <MetadataForm
              v-if="selectedItem.metadata_private"
              ref="privateMeta"
              :value="selectedItem.metadata_private"
              :disabled="!canModify"
              is-private
              model="items"
            />
          </template>
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Items.Remove"
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
    "title": "Magazyn",
    "add": "Dodaj przedmiot",
    "editTitle": "Edycja przedmiotu",
    "newTitle": "Nowy przedmiot",
    "deleteText": "Czy na pewno chcesz usunąć ten przedmiot?",
    "form": {
      "sku": "SKU",
      "quantity": "Ilość w magazynie"
    },
    "alerts": {
      "deleted": "Przedmiot magazynowy został usunięty.",
      "created": "Przedmiot magazynowy został dodany.",
      "updated": "Przedmiot magazynowy został zaktualizowany."
    }
  },
  "en": {
    "title": "Warehouse",
    "add": "Add item",
    "editTitle": "Edit item",
    "newTitle": "New item",
    "deleteText": "Are you sure you want to delete this item?",
    "form": {
      "sku": "SKU",
      "quantity": "Quantity in stock"
    },
    "alerts": {
      "deleted": "Item in warehouse has been deleted.",
      "created": "Item in warehouse has been added.",
      "updated": "Item in warehouse has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ItemsFilter, {
  EMPTY_ITEMS_FILTERS,
  ItemsFilersType,
} from '@/components/modules/items/ItemsFilter.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { UUID } from '@/interfaces/UUID'
import { WarehouseItem, WarehouseItemCreateDto } from '@/interfaces/WarehouseItem'
import { TableConfig } from '@/interfaces/CmsTable'
import { ALL_FILTER_VALUE } from '@/consts/filters'
import { formatFilters } from '@/utils/utils'

const EMPTY_FORM: WarehouseItemCreateDto = {
  name: '',
  sku: '',
  unlimited_stock_shipping_time: null,
  unlimited_stock_shipping_date: null,
}

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    ModalForm,
    PopConfirm,
    ValidationObserver,
    PaginatedList,
    ItemsFilter,
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
    filters: { ...EMPTY_ITEMS_FILTERS } as ItemsFilersType,
    isModalActive: false,
    editedItem: { ...EMPTY_FORM } as WarehouseItemCreateDto & Partial<WarehouseItem>,
    selectedItem: null as null | WarehouseItem,
    editedOriginalQuantity: 0,
  }),
  computed: {
    depositsError(): Error | null {
      // @ts-ignore // TODO: fix extended store getters typings
      return this.$accessor.items.getDepositError
    },
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Items.Edit : this.$p.Items.Add)
    },
    tableConfig(): TableConfig<WarehouseItem> {
      return {
        rowOnClick: (item) => this.openModal(item.id),
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string, sortable: true },
          { key: 'sku', label: this.$t('form.sku') as string, width: '0.5fr', sortable: true },
          {
            key: 'quantity',
            label: this.$t('form.quantity') as string,
            width: '0.5fr',
            sortable: true,
          },
        ],
      }
    },
  },
  watch: {
    depositsError(depositsError) {
      if (depositsError) {
        // eslint-disable-next-line no-console
        console.error('depositsError', depositsError)
        this.$toast.error(depositsError.message)
      }
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
    this.filters.sold_out = (this.$route.query.sold_out as string) || ALL_FILTER_VALUE
    this.filters.sort = (this.$route.query.sort as string) || ''
  },
  methods: {
    makeSearch(filters: ItemsFilersType) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'items',
        query: { page: undefined, ...queryFilters },
      })
    },

    clearFilters() {
      this.filters.search = ''
      this.filters.sold_out = ALL_FILTER_VALUE
      this.makeSearch({ ...EMPTY_ITEMS_FILTERS })
    },

    openModal(id?: UUID) {
      if (!this.$verboseCan(this.$p.Items.ShowDetails)) return
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$accessor.items.getFromListById(id)
        this.selectedItem = this.$accessor.items.getFromListById(id)
        this.editedOriginalQuantity = this.editedItem.quantity || 0
      } else {
        this.editedItem = { ...EMPTY_FORM }
        this.selectedItem = null
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      const isNew = !this.editedItem.id
      let success = false
      if (this.editedItem.id) {
        // Metadata can be saved only after product is created
        await this.saveMetadata(this.editedItem.id)

        const quantityDiff = (this.editedItem.quantity || 0) - this.editedOriginalQuantity
        if (quantityDiff) {
          // @ts-ignore // TODO: fix extended store actions typings
          success = await this.$accessor.items.updateQuantity({
            id: this.editedItem.id,
            deposit: { quantity: quantityDiff },
          })
        }

        success = !!(await this.$accessor.items.update({
          id: this.editedItem.id,
          item: this.editedItem,
        }))
      } else {
        success = !!(await this.$accessor.items.add(this.editedItem))
      }
      this.$accessor.stopLoading()

      if (success) {
        this.isModalActive = false

        if (!isNew) this.$toast.success(this.$t('alerts.updated') as string)
        else this.$toast.success(this.$t('alerts.created') as string)
      }
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.items.remove(this.editedItem.id!)
      this.$toast.success(this.$t('alerts.deleted') as string)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
  },
})
</script>
