<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="authSessions">
      <template #nav>
        <pop-confirm
          v-can="$p.Auth.SessionsRevoke"
          :title="$t('logoutAllConfirm')"
          :ok-text="$t('common.delete')"
          :cancel-text="$t('common.cancel')"
          @confirm="killAllSessions"
        >
          <icon-button type="danger" :disabled="!areSessionsToKill">
            <template #icon>
              <i class="bx bx-trash"></i>
            </template>
            {{ $t('logoutAll') }}
          </icon-button>
        </pop-confirm>
      </template>

      <template #default="{ item: login }">
        <list-item :key="login.id" class="login-item" no-hover>
          <template #avatar>
            <avatar> <i :class="getBrowserIcon(login.browser)"></i> </avatar>
          </template>
          <span v-if="login.platform">
            {{ login.platform + ' ' + login.browser + ' ' + login.browser_ver }}
          </span>
          <span v-else>{{ $t('unknownDevice') }}</span>
          <small v-if="login.ip" class="login-item__ip"> ({{ login.ip }})</small>
          <small v-if="!login.revoked" class="login-item__active">{{ $t('active') }}</small>
          <small>{{ login.created_at }}</small>

          <template #action>
            <small v-if="login.current_session" class="login-item__current">{{
              $t('yourSession')
            }}</small>
            <pop-confirm
              v-can="$p.Auth.SessionsRevoke"
              :title="$t('logoutConfirm')"
              :ok-text="$t('common.delete')"
              :cancel-text="$t('common.cancel')"
              @confirm="killSession(login.id)"
            >
              <icon-button
                v-if="!login.revoked && !login.current_session"
                type="danger"
                size="small"
              >
                <template #icon>
                  <i class="bx bx-trash"></i>
                </template>
                {{ $t('logout') }}
              </icon-button>
            </pop-confirm>
          </template>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Sesje użytkownika",
    "logoutAll": "Wyloguj wszystkie",
    "logoutAllConfirm": "Czy na pewno chcesz wylogować wszystkie sesje użytkownika? Tylko obecna pozostanie aktywna.",
    "logoutConfirm": "Czy na pewno chcesz wylogować tę sesję użytkownika?",
    "logout": "Wyloguj",
    "active": "Sesja aktywna",
    "unknownDevice": "Nieznane urządzenie",
    "yourSession": "To ty"
  },
  "en": {
    "title": "User sessions",
    "logoutAll": "Logout all",
    "logoutAllConfirm": "Are you sure you want to logout all user sessions? Only current session will be active.",
    "logoutConfirm": "Are you sure you want to logout this user session?",
    "logout": "Logout",
    "active": "Active session",
    "unknownDevice": "Unknown device",
    "yourSession": "This is you"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import { UUID } from '@/interfaces/UUID'
import Avatar from '@/components/layout/Avatar.vue'

export default Vue.extend({
  metaInfo: { title: 'Sesje użytkownika' },
  components: {
    PaginatedList,
    ListItem,
    PopConfirm,
    Avatar,
  },
  computed: {
    areSessionsToKill(): boolean {
      return this.$accessor.authSessions.getData.filter((s) => !s.revoked).length > 1
    },
  },
  methods: {
    getBrowserIcon(browser: string) {
      switch (browser) {
        case null:
          return 'bx bx-question-mark'
        case 'Safari':
          return 'bx bxl-apple'
        case 'IE':
          return 'bx bxl-internet-explorer'
        default:
          return `bx bxl-${browser.toLowerCase()}`
      }
    },
    killSession(id: UUID) {
      // @ts-ignore // TODO: fix extended store actions typings
      this.$accessor.authSessions.kill(id)
    },
    killAllSessions() {
      // @ts-ignore // TODO: fix extended store actions typings
      this.$accessor.authSessions.killAll()
    },
  },
})
</script>

<style lang="scss" scoped>
.login-item {
  $activeColor: $green-color-500;

  &__active {
    color: $activeColor;
  }

  &__current {
    width: 70px;
    margin-right: 5px;
    box-sizing: border-box;
    background-color: lighten($activeColor, 50%);
    text-align: center;
    color: $activeColor;
    border: dashed 1px $activeColor;
    border-radius: 8px;
    padding: 4px;
  }

  &__ip {
    display: inline;
  }
}
</style>
