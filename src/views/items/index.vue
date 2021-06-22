<template>
  <div>
    <PaginatedList title="Magazyn" storeKey="items" :filters="{ filters }">
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
        <vs-button @click="openModal()" color="dark" icon>
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

<script>
import { ValidationObserver } from 'vee-validate'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/ModalForm.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

export default {
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
    editedItem: {
      name: '',
      sku: '',
    },
    editedOriginalQuantity: 0,
  }),
  computed: {
    depositsError() {
      return this.$store.getters['items/getDepositError']
    },
    currency() {
      return this.$store.state.currency
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

    openModal(id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['items/getFromListById'](id)
        this.editedOriginalQuantity = this.editedItem.quantity || 0
      } else {
        this.editedItem = {
          name: '',
          sku: '',
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      let success = false
      if (this.editedItem.id) {
        const quantityDiff = this.editedItem.quantity - this.editedOriginalQuantity
        if (quantityDiff) {
          success = await this.$store.dispatch('items/updateQuantity', {
            id: this.editedItem.id,
            quantity: quantityDiff,
          })
        }

        success = await this.$store.dispatch('items/update', {
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        success = await this.$store.dispatch('items/add', this.editedItem)
      }
      loading.close()

      if (success) {
        this.isModalActive = false
      }
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('items/remove', this.editedItem.id)
      loading.close()
      this.isModalActive = false
    },
  },
  created() {
    this.filters.search = this.$route.query.search || ''
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
}
</script>
