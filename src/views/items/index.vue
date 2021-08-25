<template>
  <div>
    <PaginatedList title="Magazyn" store-key="items" :filters="filters">
      <template #nav>
        <vs-input
          v-model="filters.search"
          state="dark"
          type="search"
          placeholder="Wyszukiwanie"
          @keydown.enter="makeSearch"
        />

        <vs-button color="dark" icon @click="makeSearch">
          <i class="bx bx-search"></i>
        </vs-button>
        <vs-button v-can="$p.Items.Add" color="dark" icon @click="openModal()">
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
      <vs-dialog v-model="isModalActive" width="550px" not-center>
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja' : 'Nowy' }} przedmiot</h4>
        </template>
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
            <vs-button v-if="canModify" color="dark" @click="handleSubmit(saveModal)">
              Zapisz
            </vs-button>
            <pop-confirm
              v-slot="{ open }"
              v-can="$p.Items.Remove"
              title="Czy na pewno chcesz usunąć ten przedmiot?"
              ok-text="Usuń"
              cancel-text="Anuluj"
              @confirm="deleteItem"
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
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Items.Edit : this.$p.Items.Add)
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
