<template>
  <div class="settings-page narrower-page">
    <top-nav :title="$t('nav.settings')" />

    <card>
      <list>
        <div v-for="(group, section) in settingsGroups" :key="section">
          <h2 v-can.any="groupPermissions(group)" class="section-title">
            {{ $t(`sections.${section}`) }}
          </h2>
          <SettingsItem
            v-for="item in group"
            :key="item.id"
            :v-can="item.can"
            :name="$t(item.label)"
            :url="item.to"
            :icon-class="item.iconClass"
            :svg-icon-path="item.svgIconPath"
          />
        </div>

        <h2 class="section-title">{{ $t('sections.account') }}</h2>
        <SettingsItem
          :name="$t('items.user_account')"
          icon-class="bx bxs-bell"
          @click="isUserAccountModal = true"
        />
        <SettingsItem :name="$t('items.menu')" icon-class="bx bx-menu" url="/settings/menu" />
        <SettingsItem
          :name="$t('items.lang_preferences')"
          icon-class="bx bxs-user-detail"
          @click="isLangPreferencesModal = true"
        />
        <SettingsItem
          :name="$t('items.change_password')"
          icon-class="bx bxs-lock"
          @click="isChangePasswordModal = true"
        />
        <SettingsItem
          :name="$t('items.2fa')"
          icon-class="bx bx-mobile-vibration"
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
          icon-class="bx bx-history"
          url="/settings/login-history"
        /> -->
        <SettingsItem
          :name="$t('items.logout')"
          icon-class="bx bx-log-out-circle"
          @click="logout"
        />
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

<i18n lang="json">
{
  "en": {
    "sections": {
      "shop": "Shop",
      "products": "Products",
      "orders": "Orders",
      "shipping": "Shipping",
      "users": "Users",
      "other": "Other",
      "account": "Account"
    },
    "items": {
      "users": "Users list",
      "roles": "User roles",
      "payment_methods": "Payment methods",
      "consents": "Marketing consents",
      "seo": "SEO settings",
      "advanced": "Advanced settings",
      "lang_preferences": "Language preferences",
      "user_account": "User account",
      "menu": "Customize menu",
      "change_password": "Change password",
      "2fa": "Two-factor authentication",
      "sessions": "Login history",
      "logout": "Logout"
    }
  },

  "pl": {
    "sections": {
      "shop": "Sklep",
      "products": "Produkty",
      "orders": "Zamówienia",
      "shipping": "Dostawa",
      "users": "Użytkownicy",
      "other": "Inne",
      "account": "Konto"
    },
    "items": {
      "users": "Lista użytkowników",
      "roles": "Role użytkowników",
      "consents": "Zgody marketingowe",
      "payment_methods": "Metody płatności",
      "seo": "Ustawienia SEO",
      "advanced": "Ustawienia zaawansowane",
      "lang_preferences": "Preferencje językowe",
      "user_account": "Konto użytkownika",
      "menu": "Dostosuj menu",
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
import { groupBy, Dictionary } from 'lodash'
import { User } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import List from '@/components/layout/List.vue'
import ChangePasswordForm from '@/components/modules/auth/ChangePassword.vue'
import UserAccountForm from '@/components/modules/settings/UserAccount.vue'
import SettingsItem from '@/components/modules/settings/SettingsItem.vue'
import LangPreferencesForm from '@/components/modules/settings/LangPreferences.vue'

import { SettingsSection, SETTINGS_LINKS, MenuLink } from '@/consts/menuItems'

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
    SETTINGS_LINKS(): MenuLink[] {
      return SETTINGS_LINKS
    },
    SettingsSection(): typeof SettingsSection {
      return SettingsSection
    },
    settingsGroups(): Dictionary<MenuLink[]> {
      return groupBy(this.SETTINGS_LINKS, 'section')
    },
    user(): User {
      return this.$accessor.auth.user!
    },
  },
  methods: {
    async logout() {
      await this.$accessor.auth.logout()
      this.$router.push('/login')
    },
    groupPermissions(items: MenuLink[]) {
      return items.map((item) => item.can)
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
.avatar__content {
  font-size: 21px !important;
}
</style>
