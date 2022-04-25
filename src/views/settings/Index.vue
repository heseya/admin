<template>
  <div class="settings-page narrower-page">
    <top-nav :title="$t('nav.settings')" />

    <card>
      <list>
        <h2 v-can.any="[$p.Pages.Show, $p.Banners.Show]" class="section-title">
          {{ $t('sections.shop') }}
        </h2>
        <SettingsItem
          v-can="$p.Pages.Show"
          :name="$t('models.pages')"
          url="/pages"
          icon="bx bxs-copy-alt"
        />
        <SettingsItem
          v-can="$p.Banners.Show"
          :name="$t('models.banners')"
          url="/settings/banners"
          icon="bx bxs-image"
        />

        <h2 v-can.any="[$p.Tags.Show, $p.Products.Show]" class="section-title">
          {{ $t('models.products') }}
        </h2>
        <SettingsItem
          v-can="$p.Tags.Show"
          :name="$t('models.tags')"
          icon="bx bxs-purchase-tag"
          url="/settings/tags"
        />
        <SettingsItem
          v-can="$p.Tags.Show"
          :name="$t('models.attributes')"
          icon="bx bx-spreadsheet"
          url="/settings/attributes"
        />
        <SettingsItem
          v-can="$p.Products.Show"
          :name="$t('models.schemas')"
          icon="bx bxs-customize"
          url="/schemas"
        />

        <h2 v-can.any="[$p.Statuses.Show]" class="section-title">{{ $t('models.orders') }}</h2>
        <SettingsItem
          v-can="$p.Statuses.Show"
          :name="$t('models.statuses')"
          icon="bx bxs-check-circle"
          url="/settings/statuses"
        />

        <h2 v-can.any="[$p.ShippingMethods.Show, $p.Packages.Show]" class="section-title">
          {{ $t('sections.shipping') }}
        </h2>
        <SettingsItem
          v-can="$p.ShippingMethods.Show"
          :name="$t('models.shipping_methods')"
          icon="bx bxs-truck"
          url="/settings/shipping-methods"
        />
        <SettingsItem
          v-can="$p.Packages.Show"
          :name="$t('models.package_templates')"
          icon="bx bxs-box"
          url="/settings/package-templates"
        />

        <h2 v-can.any="[$p.Roles.Show, $p.Users.Show]" class="section-title">
          {{ $t('models.users') }}
        </h2>
        <SettingsItem
          v-can="$p.Users.Show"
          :name="$t('items.users')"
          icon="bx bxs-group"
          url="/settings/users"
        />
        <SettingsItem
          v-can="$p.Roles.Show"
          :name="$t('items.roles')"
          icon="bx bx-task"
          url="/settings/roles"
        />

        <h2 class="section-title">{{ $t('sections.other') }}</h2>
        <SettingsItem
          v-can="$p.Apps.Show"
          :name="$t('models.apps')"
          icon="bx bxs-store-alt"
          url="/apps"
        />
        <SettingsItem
          v-can="$p.Webhooks.Show"
          :name="$t('models.webhooks')"
          icon="bx bxs-bot"
          url="/webhooks"
        />
        <SettingsItem :name="$t('items.seo')" icon="bx bxl-google" url="/settings/seo" />
        <SettingsItem
          v-can="$p.Settings.Show"
          :name="$t('items.advanced')"
          icon="bx bxs-cog"
          url="/settings/advanced"
        />

        <h2 class="section-title">{{ $t('sections.account') }}</h2>
        <SettingsItem
          :name="$t('items.user_account')"
          icon="bx bxs-bell"
          @click="isUserAccountModal = true"
        />
        <SettingsItem
          :name="$t('items.lang_preferences')"
          icon="bx bxs-user-detail"
          @click="isLangPreferencesModal = true"
        />
        <SettingsItem
          :name="$t('items.change_password')"
          icon="bx bxs-lock"
          @click="isChangePasswordModal = true"
        />
        <SettingsItem
          :name="$t('items.2fa')"
          icon="bx bx-mobile-vibration"
          url="/settings/two-factor-authentication"
        >
          <template #action>
            <BooleanTag
              :value="user.is_tfa_active"
              :true-text="$t('common.active')"
              :false-text="$t('common.inactive')"
            />
          </template>
        </SettingsItem>
        <!-- <SettingsItem
          v-can="$p.Auth.SessionsShow"
          :name="$t('items.sessions')"
          icon="bx bx-history"
          url="/settings/login-history"
        /> -->
        <SettingsItem :name="$t('items.logout')" icon="bx bx-log-out-circle" @click="logout" />
      </list>
    </card>

    <a-modal
      v-model="isChangePasswordModal"
      width="500px"
      :footer="null"
      :title="$t('items.change_password')"
    >
      <ChangePasswordForm @close="isChangePasswordModal = false" />
    </a-modal>

    <a-modal
      v-model="isLangPreferencesModal"
      width="500px"
      :footer="null"
      :title="$t('items.lang_preferences')"
    >
      <LangPreferencesForm @close="isLangPreferencesModal = false" />
    </a-modal>

    <a-modal
      v-model="isUserAccountModal"
      width="500px"
      :footer="null"
      :title="$t('items.user_account')"
    >
      <UserAccountForm :user="user" @success="isUserAccountModal = false" />
    </a-modal>
  </div>
</template>

<i18n>
{
  "en": {
    "sections": {
      "shop": "Shop",
      "shipping": "Shipping",
      "other": "Other",
      "account": "Account"
    },
    "items": {
      "users": "Users list",
      "roles": "User roles",
      "seo": "SEO settings",
      "advanced": "Advanced settings",
      "lang_preferences": "Language preferences",
      "user_account": "User account",
      "change_password": "Change password",
      "2fa": "Two-factor authentication",
      "sessions": "Login history",
      "logout": "Logout"
    }
  },

  "pl": {
    "sections": {
      "shop": "Sklep",
      "shipping": "Dostawa",
      "other": "Inne",
      "account": "Konto"
    },
    "items": {
      "users": "Lista użytkowników",
      "roles": "Role użytkowników",
      "seo": "Ustawienia SEO",
      "advanced": "Ustawienia zaawansowane",
      "lang_preferences": "Preferencje językowe",
      "user_account": "Konto użytkownika",
      "change_password": "Zmień hasło",
      "2fa": "Weryfikacja dwuetapowa",
      "sessions": "Sesje użytkownika",
      "logout": "Wyloguj"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import List from '@/components/layout/List.vue'
import ChangePasswordForm from '@/components/modules/auth/ChangePassword.vue'
import UserAccountForm from '@/components/modules/settings/UserAccount.vue'
import SettingsItem from '@/components/modules/settings/SettingsItem.vue'
import LangPreferencesForm from '@/components/modules/settings/LangPreferences.vue'

import { User } from '@/interfaces/User'

export default Vue.extend({
  metaInfo(this: any) {
    return {
      title: this.$t('nav.settings') as string,
    }
  },
  components: {
    TopNav,
    Card,
    List,
    SettingsItem,
    ChangePasswordForm,
    UserAccountForm,
    LangPreferencesForm,
  },
  beforeRouteLeave(to, from, next) {
    if (this.isChangePasswordModal) {
      this.isChangePasswordModal = false
      next(false)
    } else {
      next()
    }
  },
  data: () => ({
    isChangePasswordModal: false,
    isLangPreferencesModal: false,
    isUserAccountModal: false,
  }),
  computed: {
    user(): User {
      return this.$accessor.auth.user!
    },
  },
  methods: {
    async logout() {
      await this.$accessor.auth.logout()
      this.$router.push('/login')
    },
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
    font-weight: 600;
  }
}

.section-title {
  font-weight: 600;
  margin-bottom: 5px;
  margin-top: 16px;
}
</style>
