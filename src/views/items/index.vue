<template>
  <div>
    <top-nav title="Półprodukty">
      <vs-input
        state="dark"
        type="search"
        v-model="search"
        @keydown.enter="makeSearch"
        placeholder="Wyszukiwanie"
      />

      <vs-button @click="makeSearch" color="dark" icon>
        <i class="bx bx-search"></i>
      </vs-button>
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!items.length">Nie ma żadnego zamówienia</app-empty>
      <list>
        <list-item v-for="item in items" :key="item.id" @click="openModal(item.id)">
          {{ item.name }}
          <small>{{ item.sku }}</small>
        </list-item>
      </list>
    </card>

    <vs-pagination
      @input="changePage"
      color="dark"
      v-if="meta.last_page"
      :value="page"
      :length="meta.last_page"
    />

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja' : 'Dodawanie' }} półproduktu</h4>
        </template>
        <modal-form>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.name" label="Nazwa">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.sku" label="SKU">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider v-slot="{ errors }">
            <vs-input type="number" v-model="editedItem.quantity" label="Ilość w magazynie">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć ten półprodukt?"
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
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ModalForm from '@/components/ModalForm.vue'
import PopConfirm from '@/components/PopConfirm.vue'
import ListItem from '@/components/ListItem.vue'
import Empty from '@/components/Empty.vue'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    ModalForm,
    appEmpty: Empty,
    PopConfirm,
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    page: 1,
    search: '',
    isModalActive: false,
    editedItem: {
      name: '',
      sku: ''
    },
    editedOriginalQuantity: 0
  }),
  computed: {
    items() {
      return this.$store.getters['items/getData']
    },
    meta() {
      return this.$store.getters['items/getMeta']
    },
    error() {
      return this.$store.getters['items/getError']
    },
    depositsError() {
      return this.$store.getters['items/getDepositError']
    },
    currency() {
      return this.$store.state.currency
    }
  },
  watch: {
    '$route.query'({ page }) {
      this.page = page || 1
      if (this.meta.current_page !== page) {
        this.getItems()
        window.scrollTo(0, 0)
      }
    },
    error(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          title: error.response.data?.message || error.message,
          text: Object.values(error.response.data?.errors || {})[0] || ''
        })
      }
    },
    depositsError(depositsError) {
      if (depositsError) {
        // eslint-disable-next-line no-console
        console.log('depositsError', depositsError)
        this.$vs.notification({
          color: 'danger',
          title: depositsError.message
        })
      }
    }
  },
  methods: {
    changePage(page) {
      if (this.page !== page) {
        this.$router.push({ path: 'items', query: { page, search: this.$route.query.search } })
      }
    },
    makeSearch() {
      if (this.search !== this.$route.query.search) {
        this.$router.push({
          path: 'items',
          query: { page: undefined, search: this.search || undefined }
        })
      }
    },
    async getItems() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('items/fetch', {
        page: this.page,
        search: this.$route.query.search
      })
      loading.close()
    },

    openModal(id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['items/getFromListById'](id)
        this.editedOriginalQuantity = this.editedItem.quantity || 0
      } else {
        this.editedItem = {
          name: '',
          sku: ''
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
            quantity: quantityDiff
          })
        }

        success = await this.$store.dispatch('items/update', {
          id: this.editedItem.id,
          item: this.editedItem
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
    }
  },
  created() {
    this.page = this.$route.query.page || 1
    this.search = this.$route.query.search || ''
    this.getItems()
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  }
}
</script>
