<template>
  <div>
    <PaginatedList title="Historia logowania" storeKey="loginHistory" v-slot="{ item: login }">
      <list-item class="login-item">
        <template #avatar>
          <vs-avatar dark>
            <i :class="getBrowserIcon(login.browser)"></i>
          </vs-avatar>
        </template>
        <span v-if="login.platform">
          {{ login.platform + ' ' + login.browser + ' ' + login.browser_ver }}
        </span>
        <span v-else>Nieznane urządzenie</span>
        <small v-if="login.ip" class="inline"> ({{ login.ip }})</small>
        <small v-if="!login.revoked" class="green">Sesja aktywna</small>
        <small>{{ login.created_at }}</small>
      </list-item>
    </PaginatedList>
  </div>
</template>

<script>
import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'

export default {
  components: {
    PaginatedList,
    ListItem,
  },
  methods: {
    getBrowserIcon(browser) {
      switch (browser) {
        case null:
          return 'bx bx-question-mark'
        case 'Safari':
          return 'bx bxl-apple'
        case 'IE':
          return 'bx bxl-internet-explorer'
        default:
          return 'bx bxl-' + browser.toLowerCase()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.green {
  color: green;
}

.inline {
  display: inline;
}

.login-item {
  cursor: default;

  &:hover {
    background: none;
  }
}
</style>
