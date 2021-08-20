<template>
  <div class="settings-page">
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
        <h2 v-can.hide="$p.Pages.Show" class="section-title">Sklep</h2>
        <SettingsItem
          v-can.hide="$p.Pages.Show"
          name="Strony"
          url="/pages"
          icon="bx bxs-copy-alt"
        />

        <h2
          v-can.hide.any="[$p.ProductSets.Show, $p.Tags.Show, $p.Products.Show]"
          class="section-title"
        >
          Produkty
        </h2>
        <SettingsItem
          v-can.hide="$p.ProductSets.Show"
          name="Kolekcje produktów"
          url="/settings/product-sets"
          icon="bx bx-list-ul"
        />
        <SettingsItem
          v-can.hide="$p.Tags.Show"
          name="Tagi"
          icon="bx bxs-purchase-tag"
          url="/settings/tags"
        />
        <SettingsItem
          v-can.hide="$p.Products.Show"
          name="Schematy"
          icon="bx bxs-customize"
          url="/schemas"
        />

        <h2 v-can.hide.any="[$p.Statuses.Show]" class="section-title">Zamówienia</h2>
        <SettingsItem
          v-can.hide="$p.Statuses.Show"
          name="Statusy zamówień"
          icon="bx bxs-check-circle"
          url="/settings/statuses"
        />

        <h2 v-can.hide.any="[$p.ShippingMethods.Show, $p.Packages.Show]" class="section-title">
          Dostawa
        </h2>
        <SettingsItem
          v-can.hide="$p.ShippingMethods.Show"
          name="Opcje dostawy"
          icon="bx bxs-truck"
          url="/settings/shipping-methods"
        />
        <SettingsItem
          v-can.hide="$p.Packages.Show"
          name="Szablony przesyłek"
          icon="bx bxs-box"
          url="/settings/package-templates"
        />

        <h2 v-can.hide.any="[$p.Roles.Show, $p.Users.Show]" class="section-title">Użytkownicy</h2>
        <SettingsItem
          v-can.hide="$p.Users.Show"
          name="Lista użytkowników"
          icon="bx bxs-group"
          url="/settings/users"
        />
        <SettingsItem
          v-can.hide="$p.Roles.Show"
          name="Role użytkowników"
          icon="bx bx-task"
          url="/settings/roles"
        />

        <h2 v-can.hide.any="[$p.Apps.Show, $p.Settings.Show]" class="section-title">Inne</h2>
        <SettingsItem
          v-can.hide="$p.Apps.Show"
          name="Aplikacje"
          icon="bx bxs-store-alt"
          url="/apps"
        />
        <SettingsItem
          v-can.hide="$p.Settings.Show"
          name="Ustawienia zaawansowane"
          icon="bx bxs-cog"
          url="/settings/advanced"
        />

        <h2 class="section-title">Konto</h2>
        <SettingsItem name="Zmień hasło" icon="bx bxs-lock" @click="isChangePasswordModal = true" />
        <SettingsItem
          v-can.hide="$p.Auth.SessionsShow"
          name="Sesje użytkownika"
          icon="bx bx-history"
          url="/settings/login-history"
        />
        <SettingsItem name="Wyloguj" icon="bx bx-log-out-circle" @click="logout" />
      </list>
    </card>

    <vs-dialog width="350px" not-center v-model="isChangePasswordModal">
      <template #header>
        <h4>Zmiana hasła</h4>
      </template>
      <ChangePasswordForm @close="isChangePasswordModal = false" />
    </vs-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import List from '@/components/layout/List.vue'
import ChangePasswordForm from '@/components/modules/auth/ChangePassword.vue'
import { User } from '@/interfaces/User'
import SettingsItem from '@/components/modules/settings/SettingsItem.vue'

export default Vue.extend({
  components: {
    TopNav,
    Card,
    List,
    SettingsItem,
    ChangePasswordForm,
  },
  data: () => ({
    isChangePasswordModal: false,
  }),
  computed: {
    user(): User {
      return this.$accessor.auth.user!
    },
  },
  methods: {
    async logout() {
      this.$accessor.startLoading()
      await this.$accessor.auth.logout()
      this.$accessor.stopLoading()
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
})
</script>

<style lang="scss" scoped>
.settings-page {
  .section-title:first-of-type {
    margin-top: 0;
  }
}

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
