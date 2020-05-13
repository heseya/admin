<template>
  <div>
    <top-nav title="Strony">
      <vs-button to="/pages/create" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <list>
        <list-item
          v-for="page in pages"
          :key="page.id"
          :url="'/pages/' + page.id"
          :hidden="!page.public"
        >
          {{ page.name }}
          <small>/{{ page.slug }}</small>
        </list-item>
      </list>
    </card>

    <vs-pagination color="dark" v-if="meta.last_page" v-model="page" :length="meta.last_page" />
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ListItem from '@/components/ListItem.vue'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem
  },
  data: () => ({
    page: 1
  }),
  computed: {
    pages() {
      return this.$store.getters['pages/getData']
    },
    meta() {
      return this.$store.getters['pages/getMeta']
    }
  },
  watch: {
    page(page) {
      if (this.meta.current_page !== page) this.getOrders(page)
      window.scrollTo(0, 0)
    }
  },
  methods: {
    async getPages(page = 1) {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('pages/fetch', { page })
      loading.close()
    }
  },
  created() {
    this.getPages()
  }
}
</script>
