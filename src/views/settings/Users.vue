<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="users">
      <template #nav>
        <icon-button v-can="$p.Users.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: user }">
        <list-item :key="user.id" @click="openModal(user.id)">
          <template #avatar>
            <avatar>
              <img :src="user.avatar" alt="" />
            </avatar>
          </template>
          {{ user.name }}
          <small>{{ user.roles.map((r) => r.name).join(', ') }}</small>

          <template #action>
            <tag v-if="user.is_tfa_active" type="success" small>
              <i class="bx bx-check"></i> {{ $t('tfaActive') }}
            </tag>
          </template>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="isNewUser(editedUser) ? $t('editTitle') : $t('newTitle')"
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

<i18n>
{
  "pl": {
    "title": "Użytkownicy",
    "add": "Dodaj użytkownika",
    "editTitle": "Edycja użytkownika",
    "newTitle": "Nowy użytkownik",
    "deleteText": "Czy na pewno chcesz usunąć tego użytkownika?",
    "tfaActive": "2FA aktywne"
  },
  "en": {
    "title": "Users",
    "add": "Add user",
    "editTitle": "Edit user",
    "newTitle": "New user",
    "deleteText": "Are you sure you want to delete this user?",
    "tfaActive": "2FA active"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import UserForm from '@/components/modules/users/Form.vue'
import Avatar from '@/components/layout/Avatar.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { UUID } from '@/interfaces/UUID'
import { CreateUserDTO, EditUserDTO, User } from '@/interfaces/User'

const CLEAR_USER: CreateUserDTO = {
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
    ListItem,
    UserForm,
    PopConfirm,
    ValidationObserver,
    Avatar,
    MetadataForm,
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
    editedUser: clone(CLEAR_USER) as CreateUserDTO | EditUserDTO,
    selectedUser: null as User | null,
  }),
  computed: {
    isEditedUserCurrentUser(): boolean {
      return !this.isNewUser(this.editedUser) && this.editedUser.id === this.$accessor.auth.user?.id
    },
    canModify(): boolean {
      return this.$can(this.isNewUser(this.editedUser) ? this.$p.Users.Edit : this.$p.Users.Add)
    },
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

    isNewUser(user: CreateUserDTO | EditUserDTO): user is CreateUserDTO {
      return 'id' in user === false
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
  },
})
</script>
