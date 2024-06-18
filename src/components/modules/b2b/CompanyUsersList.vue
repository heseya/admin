<template>
  <card class="company-users">
    <top-nav tag="h2" :title="$t('title').toString()" class="company-users__nav">
      <icon-button size="small" type="primary" @click="isAddUserModalActive = true">
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

        <a-dropdown v-can.any="$p.Users.Edit" :trigger="['click']">
          <icon-button class="user-item__btn" type="transparent">
            <template #icon> <i class="bx bx-dots-vertical-rounded"></i> </template>
          </icon-button>

          <template #overlay>
            <a-menu>
              <a-menu-item>
                <router-link :to="`/settings/users/${user.id}`">
                  <i class="bx bx-edit"></i> &nbsp; {{ $t('common.edit') }}
                </router-link>
              </a-menu-item>
              <a-menu-item>
                <pop-confirm
                  :ok-text="$t('common.delete').toString()"
                  :cancel-text="$t('common.cancel').toString()"
                  placement="bottom"
                  @confirm="removeUserFromCompany(user)"
                >
                  <template #title> {{ $t('confirmRemoveUserFromCompany') }} </template>
                  <i class="bx bx-trash"></i> &nbsp; {{ $t('common.delete') }}
                </pop-confirm>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <a-modal v-model="isAddUserModalActive" width="800px" :title="$t('addTitle')" :footer="null">
      <modal-form v-if="isAddUserModalActive">
        <selector
          :type-name="$t('searchName').toString()"
          type="users"
          :existing="users"
          @select="addUserToCompany"
        />
      </modal-form>
    </a-modal>
  </card>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Użytkownicy",
    "searchName": "użytkownika",
    "empty": "Brak użytkowników przypisanych do tej firmy",
    "add": "Dodaj użytkownika",
    "addTitle": "Dodaj użytkownika do firmy",
    "confirmRemoveUserFromCompany": "Czy na pewno chcesz usunąć użytkownika z firmy?"
  },
  "en": {
    "title": "Users",
    "searchName": "user",
    "empty": "No users assigned to this company",
    "add": "Add user",
    "addTitle": "Add user to company",
    "confirmRemoveUserFromCompany": "Are you sure you want to remove the user from the company?"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Role, UserListed } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import IconButton from '@/components/layout/IconButton.vue'
import TopNav from '@/components/layout/TopNav.vue'
import Loading from '@/components/layout/Loading.vue'
import Empty from '@/components/layout/Empty.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import Selector from '@/components/Selector.vue'

export default defineComponent({
  components: { TopNav, Card, IconButton, Loading, Empty, PopConfirm, ModalForm, Selector },
  props: {
    company: {
      type: Object as PropType<Role>,
      required: true,
    },
  },

  data: () => ({
    isLoading: false,
    isAddUserModalActive: false,
  }),

  computed: {
    users(): UserListed[] {
      return this.$accessor.users.getData
    },
  },

  async created() {
    this.isLoading = true
    await this.$accessor.users.fetch({ roles: [this.company.id] })
    this.isLoading = false
  },

  methods: {
    async removeUserFromCompany(user: UserListed) {
      this.isLoading = true
      await this.$accessor.users.update({
        id: user.id,
        item: { roles: user.roles.map((r) => r.id).filter((r) => r !== this.company.id) },
      })
      this.$accessor.users.REMOVE_DATA({ key: 'id', value: user.id })
      this.isLoading = false
    },
    async addUserToCompany(user: UserListed) {
      this.isLoading = true
      await this.$accessor.users.update({
        id: user.id,
        item: { roles: [this.company.id, ...user.roles.map((r) => r.id)] },
      })
      this.isLoading = false
    },
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
    border: 1px solid var(--background-color-700);
    border-radius: 8px;
    max-height: 100%;
  }
}

.user-item {
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
