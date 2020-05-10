<template>
  <div>
    <top-nav title="Ustawienia">
      <div class="profile">
        <span class="profile__name">{{ user.name }}</span>
        <vs-avatar>
          <img v-if="user.avatar" :src="user.avatar" />
          <i class="bx bx-user" v-else></i>
        </vs-avatar>
      </div>
    </top-nav>

    <card>
      <list>
        <h2 class="section-title">Sklep</h2>
        <list-item url="/settings/brands">
          <template v-slot:avatar>
            <i class="bx bx-star"></i>
          </template>
          Marki
        </list-item>
        <list-item url="/settings/categories">
          <template v-slot:avatar>
            <i class="bx bx-list-ul"></i>
          </template>
          Kategorie
        </list-item>
        <list-item url="/settings/shipping-methods">
          <template v-slot:avatar>
            <i class="bx bxs-truck"></i>
          </template>
          Opcje dostawy
        </list-item>

        <h2 class="section-title">Inne</h2>
        <list-item @click="logout">
          <template v-slot:avatar>
            <i class="bx bx-log-out-circle"></i>
          </template>
          Wyloguj
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
    user() {
      return this.$store.state.auth.user
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      setTimeout(() => {
        this.$router.push('/login')
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  justify-content: center;
  align-items: center;

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: block;
  }

  &__name {
    font-weight: 300;
    margin-right: 8px;
    font-size: 1.2em;
    font-family: $font-sec;
  }
}

.section-title {
  font-family: $font-sec;
  font-weight: 400;
  margin-bottom: 5px;
}
</style>
