<template>
  <div>
    <PaginatedList title="Sesje użytkownika" storeKey="authSessions">
      <template #nav>
        <pop-confirm
          title="Czy na pewno chcesz wylogować wszystkie sesje użytkownika? Tylko obecna pozostanie aktywna."
          okText="Usuń"
          cancelText="Anuluj"
          @confirm="killAllSessions"
          v-slot="{ open }"
        >
          <vs-button color="danger" @click="open" :disabled="!areSessionsToKill">
            Wyloguj wszystkie
          </vs-button>
        </pop-confirm>
      </template>

      <template v-slot="{ item: login }">
        <list-item class="login-item" no-hover>
          <template #avatar>
            <vs-avatar dark>
              <i :class="getBrowserIcon(login.browser)"></i>
            </vs-avatar>
          </template>
          <span v-if="login.platform">
            {{ login.platform + ' ' + login.browser + ' ' + login.browser_ver }}
          </span>
          <span v-else>Nieznane urządzenie</span>
          <small v-if="login.ip" class="login-item__ip"> ({{ login.ip }})</small>
          <small v-if="!login.revoked" class="login-item__active">Sesja aktywna</small>
          <small>{{ login.created_at }}</small>

          <template #action>
            <small v-if="login.current_session" class="login-item__current">To ty</small>
            <pop-confirm
              title="Czy na pewno chcesz wylogować tę sesję użytkownika?"
              okText="Usuń"
              cancelText="Anuluj"
              @confirm="killSession(login.id)"
              v-slot="{ open }"
            >
              <vs-button
                v-if="!login.revoked && !login.current_session"
                color="danger"
                @click="open"
              >
                Wyloguj
              </vs-button>
            </pop-confirm>
          </template>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import { ID } from '@/interfaces/ID'

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
    PopConfirm,
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
    killSession(id: ID) {
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
  $activeColor: #158a15;

  &__active {
    color: $activeColor;
  }

  &__current {
    width: 70px;
    margin-right: 5px;
    box-sizing: border-box;
    background-color: lighten($activeColor, 60%);
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
