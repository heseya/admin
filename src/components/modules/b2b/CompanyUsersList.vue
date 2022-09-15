<template>
  <card class="company-users">
    <top-nav tag="h2" :title="$t('title')" class="company-users__nav">
      <icon-button size="small" type="primary">
        <template #icon> <i class="bx bx-plus"></i> </template>
        {{ $t('add') }}
      </icon-button>
    </top-nav>

    <loading :active="isLoading" />

    <empty v-if="!users.length"> {{ $t('empty') }} </empty>

    <div v-else class="company-users__list">
      <div v-for="user in users" :key="user.id" class="user-item">
        <img class="user-item__avatar" :src="user.avatar" role="presentation" />

        <span class="user-item__name">
          {{ user.name }}
        </span>

        <icon-button class="user-item__btn" type="transparent">
          <template #icon> <i class="bx bx-dots-vertical-rounded"></i> </template>
        </icon-button>
      </div>
    </div>
  </card>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Użytkownicy",
    "empty": "Brak użytkowników przypisanych do tej firmy",
    "add": "Dodaj użytkownika"
  },
  "en": {
    "title": "Users",
    "empty": "No users assigned to this company",
    "add": "Add user"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Role, UserList } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import IconButton from '@/components/layout/IconButton.vue'
import TopNav from '@/components/layout/TopNav.vue'
import Loading from '@/components/layout/Loading.vue'
import Empty from '@/components/layout/Empty.vue'

export default Vue.extend({
  components: { TopNav, Card, IconButton, Loading, Empty },
  props: {
    company: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Role>,
  },

  data: () => ({
    isLoading: false,
  }),

  computed: {
    users(): UserList[] {
      return this.$accessor.users.getData
    },
  },

  async created() {
    this.isLoading = true
    await this.$accessor.users.fetch({ roles: [this.company.id] })
    this.isLoading = false
  },
})
</script>

<style lang="scss" scoped>
.company-users {
  position: relative;

  &__nav {
    margin-bottom: 8px;
  }

  &__list {
    border: 1px solid $background-color-700;
    border-radius: 8px;
    max-height: 100%;
  }
}

.user-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $background-color-700;
  padding: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: $primary-color-100;
  }

  &:last-child {
    border-bottom: none;
  }

  &__avatar {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  &__name {
    margin-left: 12px;
  }

  &__btn {
    margin-left: auto;
    font-size: 1.2em;
  }
}
</style>
