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
            :label="$t('form.name')"
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
      "name": "Nazwa",
      "sku": "SKU",
      "quantity": "Ilość w magazynie"
    }
  },
  "en": {
    "title": "Warehouse",
    "add": "Add item",
    "editTitle": "Edit item",
    "newTitle": "New item",
    "deleteText": "Are you sure you want to delete this item?",
    "form": {
      "name": "Name",
      "sku": "SKU",
      "quantity": "Quantity in stock"
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

import { UUID } from '@/interfaces/UUID'
import { ProductItem } from '@/interfaces/Product'
import { TableConfig } from '@/interfaces/CmsTable'
import { ALL_FILTER_VALUE } from '@/consts/filters'
import { formatFilters } from '@/utils/utils'

const EMPTY_FORM: ProductItem = {
  id: '',
  name: '',
  sku: '',
  quantity: 0,
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
    editedItem: { ...EMPTY_FORM },
    editedOriginalQuantity: 0,
  }),
  computed: {
    depositsError(): any {
      // @ts-ignore // TODO: fix extended store getters typings
      return this.$accessor.items.getDepositError
    },
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Items.Edit : this.$p.Items.Add)
    },
    tableConfig(): TableConfig<ProductItem> {
      return {
        rowOnClick: (item) => this.openModal(item.id),
        headers: [
          { key: 'name', label: this.$t('form.name') as string, sortable: true },
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
        this.editedOriginalQuantity = this.editedItem.quantity || 0
      } else {
        this.editedItem = { ...EMPTY_FORM }
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      let success = false
      if (this.editedItem.id) {
        const quantityDiff = this.editedItem.quantity - this.editedOriginalQuantity
        if (quantityDiff) {
          // @ts-ignore // TODO: fix extended store actions typings
          success = await this.$accessor.items.updateQuantity({
            id: this.editedItem.id,
            quantity: quantityDiff,
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
      }
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.items.remove(this.editedItem.id)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>
