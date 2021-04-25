<template>
  <div>
    <top-nav title="Aplikacje">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!apps.length">Żadna aplikacja nie jest zainstalowana</app-empty>
      <list>
        <list-item
          class="app"
          v-for="app in apps"
          :key="app.id"
        >
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bxs-extension"></i>
            </vs-avatar>
          </template>
          {{ app.name }}
        </list-item>
      </list>
    </card>

    <pagination v-if="meta.last_page" v-model="page" :length="meta.last_page" />

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>Dodaj Aplikacje</h4>
        </template>
        <modal-form>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.url" label="URL">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Dodaj</vs-button>
          </div>
        </template>
      </vs-dialog>
    </validation-observer>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ListItem from '@/components/ListItem.vue'
import Empty from '@/components/Empty.vue'
import Pagination from '../../components/Pagination.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import ModalForm from '@/components/ModalForm'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    appEmpty: Empty,
    Pagination,
    ModalForm,
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    page: 1,
    isModalActive: false,
    editedItem: {
      url: '',
    }
  }),
  computed: {
    apps() {
      return this.$store.getters['apps/getData']
    },
    meta() {
      return this.$store.getters['apps/getMeta']
    },
  },
  watch: {
    page(page) {
      if (this.meta.current_page !== page) this.getApps(page)
      window.scrollTo(0, 0)
    },
  },
  methods: {
    async getApps(page = 1) {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('apps/fetch', { page })
      loading.close()
    },
    openModal() {
      this.isModalActive = true
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('apps/add', this.editedItem)
      await this.$store.dispatch('apps/fetch')
      loading.close()
      this.isModalActive = false
    },
  },
  created() {
    this.getApps()
  },
}
</script>

<style lang="scss" scoped>
.app {
  cursor: default;

  &:hover {
    background: none;
  }
}
</style>
