<template>
  <div>
    <top-nav title="Marki"></top-nav>

    <card>
      <list>
        <list-item
          v-for="brand in brands"
          :key="brand.id"
          url="#"
          :hidden="!brand.public"
        >
          {{ brand.name }}
          <small>/{{ brand.slug }}</small>
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
    brands () {
      return this.$store.getters['brands/getData']
    }
  },
  methods: {
    async getBrands () {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('brands/fetch')
      loading.close()
    }
  },
  created () {
    this.getBrands()
  }
}
</script>
