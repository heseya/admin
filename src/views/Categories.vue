<template>
  <div>
    <top-nav title="Kategorie"></top-nav>

    <card>
      <list>
        <list-item
          v-for="category in categories"
          :key="category.id"
          url="#"
          :hidden="!category.public"
        >
          {{ category.name }}
          <small>/{{ category.slug }}</small>
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
    categories () {
      return this.$store.getters['categories/getData']
    }
  },
  methods: {
    async getCategories () {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('categories/fetch')
      loading.close()
    }
  },
  created () {
    this.getCategories()
  }
}
</script>
