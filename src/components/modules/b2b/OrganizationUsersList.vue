<template>
  <card class="organization-users">
    <top-nav tag="h2" :title="$t('title').toString()" class="organization-users__nav" />

    <loading :active="isLoading" />

    <empty v-if="!users.length"> {{ $t('empty') }} </empty>

    <div v-else class="organization-users__list">
      <div v-for="user in users" :key="user.id" class="organization-user-entry">
        <img class="organization-user-entry__avatar" :src="user.avatar" role="presentation" />

        <span class="organization-user-entry__name">
          {{ user.name }}
        </span>

        <a-dropdown v-can.any="$p.Users.Edit" :trigger="['click']">
          <icon-button class="organization-user-entry__btn" type="transparent">
            <template #icon> <i class="bx bx-dots-vertical-rounded"></i> </template>
          </icon-button>

          <template #overlay>
            <a-menu>
              <a-menu-item>
                <router-link :to="`/settings/users/${user.id}`">
                  <i class="bx bx-edit"></i> &nbsp; {{ $t('common.edit') }}
                </router-link>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </card>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Użytkownik",
    "empty": "Brak użytkowników przypisanych do tej organizacji",
    "usersFetchError": "Wystąpił błąd podczas pobierania użytkowników"
  },
  "en": {
    "title": "User",
    "empty": "No users assigned to this organization",
    "usersFetchError": "An error occurred while fetching users"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Organization, UserListed } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import IconButton from '@/components/layout/IconButton.vue'
import TopNav from '@/components/layout/TopNav.vue'
import Loading from '@/components/layout/Loading.vue'
import Empty from '@/components/layout/Empty.vue'

import { sdk } from '@/api'

export default defineComponent({
  components: { TopNav, Card, IconButton, Loading, Empty },
  props: {
    organization: {
      type: Object as PropType<Organization>,
      required: true,
    },
  },

  data: () => ({
    isLoading: false,
    users: [] as UserListed[],
  }),

  watch: {
    organization: {
      immediate: true,
      async handler() {
        this.isLoading = true
        try {
          const { data: users } = await sdk.Organizations.Users.get(this.organization.id)
          this.users = users
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
          this.$toast.error(this.$t('usersFetchError') as string)
        }

        // TODO: remove mock
        if (!this.users.length)
          this.users = [
            {
              id: '1',
              name: 'John Doe',
              avatar:
                'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/d3/d359dddc8193fa098ab6c29bcb921193dfe30085.jpg',
              email: '',
              birthday_date: null,
              phone: null,
              phone_country: null,
              phone_number: null,
              is_tfa_active: false,
              roles: [],
              created_at: '',
              metadata: {},
            },
          ]

        this.isLoading = false
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.organization-users {
  position: relative;

  &__nav {
    margin-bottom: 8px;
  }

  &__list {
    border: 1px solid var(--background-color-700);
    border-radius: 8px;
    max-height: 100%;
  }
}

.organization-user-entry {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--background-color-700);
  padding: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--primary-color-100);
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
