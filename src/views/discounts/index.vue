<template>
  <div>
    <top-nav title="Kody rabatowe">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!discounts.length">Nie ma jeszcze żadnych kodów rabatowych</app-empty>
      <list>
        <list-item v-for="discount in discounts" :key="discount.id" @click="openModal(discount.id)">
          {{ discount.code }}
          <small>{{ discount.description }}</small>

          <template #action>
            - {{ discount.discount }} {{ discount.type === 0 ? '%' : currency }}
            <small style="white-space: nowrap"
              >wykorzystano {{ discount.uses }} z {{ discount.max_uses }}</small
            >
          </template>
        </list-item>
      </list>
    </card>

    <app-pagination
      v-if="meta.last_page"
      :value="page"
      @input="changePage"
      :length="meta.last_page"
    />

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja kodu rabatowego' : 'Nowy kod rabatowy' }}</h4>
        </template>
        <modal-form>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.code" label="Kod">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider v-slot="{ errors }">
            <vs-input v-model="editedItem.description" label="Opis">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
            <validation-provider rules="required" v-slot="{ errors }">
              <vs-input v-model="editedItem.max_uses" label="Maksymalna ilość użyć">
                <template #message-danger>{{ errors[0] }}</template>
              </vs-input>
            </validation-provider>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.discount" label="Zniżka">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-select v-model="editedItem.type" label="Typ">
              <vs-option label="Procentowy" value="0">Rabat Procentowy</vs-option>
              <vs-option label="Kwotowy" value="1">Rabat Kwotowy</vs-option>
              <template #message-danger>{{ errors[0] }}</template>
            </vs-select>
          </validation-provider>
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <!--            <pop-confirm-->
            <!--              title="Czy na pewno chcesz usunąć ten kod?"-->
            <!--              okText="Usuń"-->
            <!--              cancelText="Anuluj"-->
            <!--              @confirm="deleteItem"-->
            <!--              v-slot="{ open }"-->
            <!--            >-->
            <!--              <vs-button v-if="editedItem.id" color="danger" @click="open">Usuń</vs-button>-->
            <!--            </pop-confirm>-->
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
import ListItem from '@/components/ListItem.vue'
import Empty from '@/components/Empty.vue'
import Pagination from '@/components/Pagination.vue'
import { formatApiError } from '@/utils/errors'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    ModalForm,
    appEmpty: Empty,
    ValidationProvider,
    ValidationObserver,
    appPagination: Pagination,
  },
  data: () => ({
    isModalActive: false,
    page: 1,
    editedItem: {
      name: '',
      slug: '',
      type: 0,
      discount: 0.0,
      max_uses: 1,
    },
  }),
  computed: {
    discounts() {
      return this.$store.getters['discounts/getData']
    },
    meta() {
      return this.$store.getters['pages/getMeta']
    },
    currency() {
      return this.$store.state.currency
    },
  },
  watch: {
    error(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
      }
    },
    '$route.query'({ page }) {
      this.page = page || 1
      if (this.meta.current_page !== page) {
        this.getOrders()
        window.scrollTo(0, 0)
      }
    },
  },
  methods: {
    changePage(page) {
      if (this.page !== page) {
        this.$router.push({ path: 'discounts', query: { page } })
      }
    },
    async getDiscounts() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('discounts/fetch', {
        page: this.page,
        limit: 50,
      })
      loading.close()
    },
    openModal(id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['discounts/getFromListById'](id)
      } else {
        this.editedItem = {
          name: '',
          slug: '',
          type: 0,
          discount: 0.0,
          max_uses: 1,
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('discounts/update', {
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$store.dispatch('discounts/add', this.editedItem)
      }
      loading.close()
      this.isModalActive = false
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('discounts/remove', this.editedItem.id)
      loading.close()
      this.isModalActive = false
    },
  },
  created() {
    this.page = this.$route.query.page || 1
    this.getDiscounts()
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
