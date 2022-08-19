<template>
  <div class="narrower-page">
    <PaginatedList
      :title="$t('title')"
      :filters="filters"
      :table="tableConfig"
      :xlsx-file-config="fileConfig"
      store-key="users"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <users-filter :filters="filters" @search="makeSearch" />
      </template>
      <template #nav>
        <icon-button v-can="$p.Users.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: user }">
        <cms-table-row
          :key="user.id"
          :item="user"
          :headers="tableConfig.headers"
          @click="openModal(user.id)"
        >
          <template #name>
            <div class="list-item">
              <div class="list-item__avatar">
                <avatar>
                  <img :src="user.avatar" alt="" />
                </avatar>
              </div>
              <div class="list-item__content">
                {{ user.name }}
              </div>
            </div>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="isNewUser(editedUser) ? $t('newTitle') : $t('editTitle')"
      >
        <UserForm v-model="editedUser" :disabled="!canModify" @close="isModalActive = false" />

        <hr />

        <template v-if="selectedUser">
          <MetadataForm
            ref="publicMeta"
            :value="selectedUser.metadata"
            :disabled="!canModify"
            model="users"
          />
          <MetadataForm
            v-if="selectedUser.metadata_private"
            ref="privateMeta"
            :value="selectedUser.metadata_private"
            :disabled="!canModify"
            is-private
            model="users"
          />
        </template>

        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Users.Remove"
              :title="$t('deleteText')"
              :ok-text="$t('common.delete')"
              :cancel-text="$t('common.cancel')"
              @confirm="deleteItem"
            >
              <app-button
                v-if="!isNewUser(editedUser)"
                :disabled="isEditedUserCurrentUser"
                type="danger"
              >
                {{ $t('common.delete') }}
              </app-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Użytkownicy",
    "add": "Dodaj użytkownika",
    "editTitle": "Edycja użytkownika",
    "newTitle": "Nowy użytkownik",
    "deleteText": "Czy na pewno chcesz usunąć tego użytkownika?",
    "table": {
      "email": "E-mail",
      "roles": "Role",
      "isTfaActive": "Aktywne 2FA"
    }
  },
  "en": {
    "title": "Users",
    "add": "Add user",
    "editTitle": "Edit user",
    "newTitle": "New user",
    "deleteText": "Are you sure you want to delete this user?",
    "table": {
      "email": "E-mail",
      "roles": "Roles",
      "isTfaActive": "Active 2FA"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'
import { Role, User, UserCreateDto, UserUpdateDto } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import UserForm from '@/components/modules/users/Form.vue'
import Avatar from '@/components/layout/Avatar.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import UsersFilter, { EMPTY_USER_FILTERS } from '@/components/modules/users/UsersFilter.vue'

import { ALL_FILTER_VALUE } from '@/consts/filters'
import { formatFilters } from '@/utils/utils'
import { UUID } from '@/interfaces/UUID'
import { TableConfig } from '@/interfaces/CmsTable'
import { XlsxFileConfig } from '@/interfaces/XlsxFileConfig'

const CLEAR_USER: UserCreateDto = {
  name: '',
  email: '',
  password: '',
  roles: [],
}

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    UserForm,
    PopConfirm,
    ValidationObserver,
    Avatar,
    CmsTableRow,
    MetadataForm,
    UsersFilter,
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
  data: () => ({
    isModalActive: false,
    editedUser: clone(CLEAR_USER) as UserCreateDto | (UserUpdateDto & { id: UUID }),
    selectedUser: null as User | null,
    filters: { ...EMPTY_USER_FILTERS },
  }),
  computed: {
    isEditedUserCurrentUser(): boolean {
      return !this.isNewUser(this.editedUser) && this.editedUser.id === this.$accessor.auth.user?.id
    },
    canModify(): boolean {
      return this.$can(this.isNewUser(this.editedUser) ? this.$p.Users.Edit : this.$p.Users.Add)
    },
    tableConfig(): TableConfig<User> {
      return {
        rowOnClick: (item) => this.openModal(item.id),
        headers: [
          {
            key: 'name',
            label: this.$t('common.form.name') as string,
            width: '1.6fr',
            sortable: true,
          },
          { key: 'email', label: this.$t('table.email') as string, width: '1.8fr' },
          {
            key: 'roles',
            label: this.$t('table.roles') as string,
            width: '1fr',
            render: (_v, item) => {
              return item.roles.length ? item.roles.map((r) => r.name).join(', ') : '-'
            },
          },
          {
            key: 'is_tfa_active',
            label: this.$t('table.isTfaActive') as string,
            width: '0.6fr',
            render: (_v, item) => item.is_tfa_active,
          },
        ],
      }
    },
    fileConfig(): XlsxFileConfig<User> {
      return {
        name: this.$t('title') as string,
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'email', label: this.$t('table.email') as string },
          {
            key: 'roles',
            label: this.$t('table.roles') as string,
            format: (v: Role[]) => v.map((role) => role.name).join(', '),
          },
          {
            key: 'is_tfa_active',
            label: this.$t('table.isTfaActive') as string,
            format: (v: boolean) => (v ? this.$t('common.yes') : this.$t('common.no')) as string,
          },
        ],
      }
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
    this.filters.consent_id = (this.$route.query.consent_id as string) || ALL_FILTER_VALUE
  },
  methods: {
    openModal(id?: UUID) {
      if (!this.$verboseCan(this.$p.Users.ShowDetails)) return

      this.isModalActive = true
      if (id) {
        const user = this.$accessor.users.getFromListById(id)
        this.editedUser = {
          ...user,
          roles: user.roles?.map(({ id }) => id) || [],
        }
        this.selectedUser = user
      } else {
        this.editedUser = clone(CLEAR_USER)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()

      // Metadata can be saved only after user is created
      if (!this.isNewUser(this.editedUser)) await this.saveMetadata(this.editedUser.id)

      const updated = this.isNewUser(this.editedUser)
        ? await this.$accessor.users.add(this.editedUser)
        : await this.$accessor.users.update({
            id: this.editedUser.id,
            item: this.editedUser,
          })
      if (updated) this.isModalActive = false

      if (updated && updated?.id === this.$accessor.auth.user?.id) {
        this.$accessor.auth.SET_USER(updated)
      }

      this.$accessor.stopLoading()
    },
    async deleteItem() {
      if (this.isNewUser(this.editedUser)) return

      this.$accessor.startLoading()
      await this.$accessor.users.remove(this.editedUser.id)
      this.isModalActive = false
      this.$accessor.stopLoading()
    },

    isNewUser(user: UserCreateDto | (UserUpdateDto & { id: UUID })): user is UserCreateDto {
      return 'id' in user === false
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
    makeSearch(filters: typeof EMPTY_USER_FILTERS) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'users',
        query: { page: undefined, ...queryFilters },
      })
    },
    clearFilters() {
      this.makeSearch({ ...EMPTY_USER_FILTERS })
    },
  },
})
</script>

<style lang="scss" scoped>
.list-item {
  display: flex !important;
  align-items: center;

  &__content {
    width: 100%;
    font-weight: 600;
  }

  &__avatar {
    margin-right: 13px;
  }
}
</style>
