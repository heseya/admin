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
        <h2 class="section-title">Produkty</h2>
        <list-item url="/settings/brands">
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bx-star"></i>
            </vs-avatar>
          </template>
          Marki
        </list-item>
        <list-item url="/settings/categories">
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bx-list-ul"></i>
            </vs-avatar>
          </template>
          Kategorie
        </list-item>

        <h2 class="section-title">Zamówienia</h2>
        <list-item url="/settings/statuses">
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bx-check-circle"></i>
            </vs-avatar>
          </template>
          Statusy zamówień
        </list-item>

        <h2 class="section-title">Witryna sklepu</h2>
        <list-item url="/settings/page-settings">
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bxs-cog"></i>
            </vs-avatar>
          </template>
          Ustawienia strony
        </list-item>

        <h2 class="section-title">Dostawa</h2>
        <list-item url="/settings/shipping-methods">
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bxs-truck"></i>
            </vs-avatar>
          </template>
          Opcje dostawy
        </list-item>
        <list-item url="/settings/package-templates">
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bx-box"></i>
            </vs-avatar>
          </template>
          Szablony przesyłek
        </list-item>

        <h2 class="section-title">Konto</h2>
        <list-item @click="isChangePasswordModal = true">
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bx-lock"></i>
            </vs-avatar>
          </template>
          Zmień hasło
        </list-item>
        <list-item url="/settings/login-history">
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bx-history"></i>
            </vs-avatar>
          </template>
          Historia logowania
        </list-item>
        <list-item @click="logout">
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bx-log-out-circle"></i>
            </vs-avatar>
          </template>
          Wyloguj
        </list-item>
      </list>
    </card>

    <vs-dialog width="350px" not-center v-model="isChangePasswordModal">
      <template #header>
        <h4>Zmiana hasła</h4>
      </template>
      <app-change-password @close="isChangePasswordModal = false" />
    </vs-dialog>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ListItem from '@/components/ListItem.vue'
import ChangePassword from '@/components/ChangePassword.vue'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    appChangePassword: ChangePassword,
  },
  data: () => ({
    isChangePasswordModal: false,
  }),
  computed: {
    user() {
      return this.$store.state.auth.user || {}
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isChangePasswordModal) {
      this.isChangePasswordModal = false
      next(false)
    } else {
      next()
    }
  },
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
