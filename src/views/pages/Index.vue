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
  computed: {
    pages () {
      return this.$store.state.pages.pages
    }
  },
  methods: {
    async getPages () {
      const loading = this.$vs.loading({ color: '#000' })

      try {
        await this.$store.dispatch('pages/index')
      } catch (e) {
        console.log(e)
      } finally {
        loading.close()
      }
    }
  },
  created () {
    this.getPages()
  }
}
</script>
