<template>
  <div>
    <PaginatedList
      title="Magazyn"
      store-key="items"
      :filters="filters"
      :table="tableConfig"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.Items.Add" @click="openModal()">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj przedmiot
        </icon-button>
      </template>

      <template #filters>
        <div>
          <app-input
            v-model="filters.search"
            class="span-2"
            type="search"
            label="Wyszukiwanie"
            allow-clear
            @input="debouncedSearch"
          />
        </div>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? 'Edycja przedmiot' : 'Nowy przedmiot'"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.name"
            :disabled="!canModify"
            rules="required"
            label="Nazwa"
          />

          <validated-input
            v-model="editedItem.sku"
            :disabled="!canModify"
            rules="required"
            label="SKU"
          />
          <validated-input
            v-if="editedItem.id"
            v-model="editedItem.quantity"
            :disabled="!canModify"
            rules="required"
            type="number"
            label="Ilość w magazynie"
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)"> Zapisz </app-button>
            <pop-confirm
              v-can="$p.Items.Remove"
              title="Czy na pewno chcesz usunąć ten przedmiot?"
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
import { debounce } from 'lodash'
import { ValidationObserver } from 'vee-validate'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'

import { UUID } from '@/interfaces/UUID'
import { ProductItem } from '@/interfaces/Product'
import { TableConfig } from '@/interfaces/CmsTable'

const EMPTY_FORM: ProductItem = {
  id: '',
  name: '',
  sku: '',
  quantity: 0,
}

export default Vue.extend({
  metaInfo: { title: 'Magazyn' },
  components: {
    ModalForm,
    PopConfirm,
    ValidationObserver,
    PaginatedList,
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
    filters: {
      search: '',
    },
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
          { key: 'name', label: 'Nazwa' },
          { key: 'sku', label: 'SKU', width: '0.5fr' },
          { key: 'quantity', label: 'Ilość w magazynie', width: '0.5fr' },
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
  },
  methods: {
    makeSearch() {
      if (this.filters.search !== this.$route.query.search) {
        this.$router.push({
          path: 'items',
          query: { page: undefined, search: this.filters.search || undefined },
        })
      }
    },
    debouncedSearch: debounce(function (this: any) {
      this.$nextTick(() => {
        this.makeSearch()
      })
    }, 300),
    clearFilters() {
      this.filters.search = ''
      this.makeSearch()
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
