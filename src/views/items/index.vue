<template>
  <div>
    <PaginatedList title="Magazyn" storeKey="items" :filters="filters">
      <template #nav>
        <vs-input
          state="dark"
          type="search"
          v-model="filters.search"
          @keydown.enter="makeSearch"
          placeholder="Wyszukiwanie"
        />

        <vs-button @click="makeSearch" color="dark" icon>
          <i class="bx bx-search"></i>
        </vs-button>
        <vs-button v-can="$p.Items.Add" @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item }">
        <list-item @click="openModal(item.id)">
          {{ item.name }}
          <small>{{ item.sku }}</small>
          <template #action>
            <small>{{ item.quantity }} sztuk</small>
          </template>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja' : 'Nowy' }} przedmiot</h4>
        </template>
        <modal-form>
          <validated-input rules="required" v-model="editedItem.name" label="Nazwa" />

          <validated-input rules="required" v-model="editedItem.sku" label="SKU" />
          <validated-input
            rules="required"
            v-if="editedItem.id"
            type="number"
            v-model="editedItem.quantity"
            label="Ilość w magazynie"
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć ten przedmiot?"
              v-can="$p.Items.Add"
              okText="Usuń"
              cancelText="Anuluj"
              @confirm="deleteItem"
              v-slot="{ open }"
            >
              <vs-button v-if="editedItem.id" color="danger" @click="open">Usuń</vs-button>
            </pop-confirm>
          </div>
        </template>
      </vs-dialog>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'
import { UUID } from '@/interfaces/UUID'
import { ProductItem } from '@/interfaces/Product'

const EMPTY_FORM: ProductItem = {
  id: '',
  name: '',
  sku: '',
  quantity: 0,
}

export default Vue.extend({
  components: {
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    PaginatedList,
    ValidatedInput,
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
    currency(): string {
      return this.$accessor.currency
    },
  },
  watch: {
    depositsError(depositsError) {
      if (depositsError) {
        // eslint-disable-next-line no-console
        console.error('depositsError', depositsError)
        this.$vs.notification({
          color: 'danger',
          title: depositsError.message,
        })
      }
    },
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

    openModal(id?: UUID) {
      if (!this.$verboseCan([this.$p.Items.Add, this.$p.Items.Edit])) return
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
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
})
</script>
