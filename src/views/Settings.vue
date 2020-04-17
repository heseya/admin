<template>
  <div>
    <top-nav title="Ustawienia"></top-nav>

    <card>
      <list>
        <list-item url="/settings/brands">
          Marki
        </list-item>
        <list-item url="/settings/categories">
          Kategorie
        </list-item>
        <list-item url="/settings/shipping-methods">
          Opcje dostawy
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
  }
}
</script>
