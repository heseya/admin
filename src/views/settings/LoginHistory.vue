<template>
  <div>
    <top-nav title="Historia logowania"></top-nav>

    <card>
      <app-empty v-if="!history.length">Historia logowania jest pusta</app-empty>
      <list>
        <list-item v-for="login in history" :key="login.created_at" class="login-item">
          <template #avatar>
            <vs-avatar dark>
              <i :class="getBrowserIcon(login.browser)"></i>
            </vs-avatar>
          </template>
          <span v-if="login.platform">{{
            login.platform + ' ' + login.browser + ' ' + login.browser_ver
          }}</span>
          <span v-else>Nieznane urządzenie</span>
          <small v-if="login.ip" class="inline"> ({{ login.ip }})</small>
          <small v-if="!login.revoked" class="green">Sesja aktywna</small>
          <small>{{ login.created_at }}</small>
        </list-item>
      </list>
    </card>
    <pagination v-if="meta.last_page" :value="page" @input="changePage" :length="meta.last_page" />
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import List from '@/components/layout/List.vue'
import ListItem from '@/components/layout/ListItem.vue'
import Empty from '@/components/layout/Empty.vue'
import Pagination from '@/components/Pagination'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    Pagination,
    appEmpty: Empty,
  },
  data: () => ({
    page: 1,
  }),
  computed: {
    history() {
      return this.$store.getters['loginHistory/getData']
    },
    meta() {
      return this.$store.getters['loginHistory/getMeta']
    },
  },
  watch: {
    '$route.query'({ page }) {
      this.page = page || 1
      if (this.meta.current_page !== page) {
        this.getHistory()
        window.scrollTo(0, 0)
      }
    },
  },
  methods: {
    changePage(page) {
      if (this.page !== page) {
        this.$router.push({ path: 'login-history', query: { ...this.$route.query, page } })
      }
    },
    getBrowserIcon(browser) {
      switch (browser) {
        case null:
          return 'bx bx-question-mark'
        case 'Safari':
          return 'bx bxl-apple'
        case 'IE':
          return 'bx bxl-internet-explorer'
        default:
          return 'bx bxl-' + browser.toLowerCase()
      }
    },
    async getHistory() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('loginHistory/fetch', {
        page: this.page,
      })
      loading.close()
    },
  },
  created() {
    this.page = this.$route.query.page || 1
    this.getHistory()
  },
}
</script>

<style lang="scss" scoped>
.green {
  color: green;
}

.inline {
  display: inline;
}

.login-item {
  cursor: default;

  &:hover {
    background: none;
  }
}
</style>
