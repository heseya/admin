<template>
  <div>
    <top-nav title="Schematy">
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
      <vs-button to="/schemas/create" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!schemas.length">Nie ma żadnego schematu</app-empty>
      <list>
        <list-item v-for="item in schemas" :key="item.id" :url="`/schemas/${item.id}`">
          {{ item.name }}
          <small>{{ item.description }}</small>
          <template #action>
            <small>{{ SchemaTypeLabel[item.type] }}</small>
          </template>
        </list-item>
      </list>
    </card>

    <pagination @input="changePage" v-if="meta.last_page" :value="page" :length="meta.last_page" />
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ListItem from '@/components/ListItem.vue'
import Empty from '@/components/Empty.vue'
import { SchemaTypeLabel } from '@/interfaces/SchemaType'
import Pagination from '../../components/Pagination.vue'
import { formatApiError } from '@/utils/errors'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    appEmpty: Empty,
    Pagination,
  },
  data: () => ({
    page: 1,
    search: '',
    isModalActive: false,
    SchemaTypeLabel: Object.freeze(SchemaTypeLabel),
  }),
  computed: {
    schemas() {
      return this.$store.getters['schemas/getData']
    },
    meta() {
      return this.$store.getters['schemas/getMeta']
    },
    error() {
      return this.$store.getters['schemas/getError']
    },
    currency() {
      return this.$store.state.currency
    },
  },
  watch: {
    '$route.query'({ page }) {
      this.page = page || 1
      if (this.meta.current_page !== page) {
        this.getSchemas()
        window.scrollTo(0, 0)
      }
    },
    error(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
      }
    },
  },
  methods: {
    changePage(page) {
      if (this.page !== page) {
        this.$router.push({ path: 'schemas', query: { page, search: this.$route.query.search } })
      }
    },
    makeSearch() {
      if (this.search !== this.$route.query.search) {
        this.$router.push({
          path: 'schemas',
          query: { page: undefined, search: this.search || undefined },
        })
      }
    },
    async getSchemas() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('schemas/fetch', {
        page: this.page,
        search: this.$route.query.search,
      })
      loading.close()
    },
  },
  created() {
    this.page = this.$route.query.page || 1
    this.search = this.$route.query.search || ''
    this.getSchemas()
  },
}
</script>
