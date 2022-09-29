<template>
  <div class="narrower-page">
    <top-nav :title="isNewUser(editedUser) ? $t('newTitle') : $t('editTitle')" />

    <card>
      <validation-observer v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveUser)">
          <UserForm v-model="editedUser" :disabled="!canModify" />

          <template v-if="selectedUser">
            <hr />
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

          <hr />

          <div class="row">
            <app-button v-if="canModify" type="primary" html-type="submit">
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
        </form>
      </validation-observer>
    </card>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "editTitle": "Edycja użytkownika",
    "newTitle": "Nowy użytkownik",
    "deleteText": "Czy na pewno chcesz usunąć tego użytkownika?"
  },
  "en": {
    "editTitle": "Edit user",
    "newTitle": "New user",
    "deleteText": "Are you sure you want to delete this user?"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'
import { User, UserCreateDto, UserUpdateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import UserForm from '@/components/modules/users/Form.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { UUID } from '@/interfaces/UUID'
import Card from '@/components/layout/Card.vue'

const CLEAR_USER: UserCreateDto = {
  name: '',
  email: '',
  password: '',
  roles: [],
}

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.isNewUser(this.editedUser) ? this.$t('newTitle') : this.$t('editTitle') }
  },
  components: {
    UserForm,
    PopConfirm,
    ValidationObserver,
    MetadataForm,
    TopNav,
    Card,
  },

  data: () => ({
    editedUser: clone(CLEAR_USER) as UserCreateDto | (UserUpdateDto & { id: UUID }),
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

  watch: {
    $route: {
      immediate: true,
      handler() {
        this.fetchUser()
      },
    },
  },

  methods: {
    async fetchUser() {
      const id = this.$route.params.id === 'create' ? undefined : this.$route.params.id

      if (!this.$verboseCan(this.$p.Users.ShowDetails)) return

      if (id) {
        const user = await this.$accessor.users.get(id)
        if (!user) return this.$router.replace('/settings/users/create')

        this.editedUser = {
          ...user,
          roles: user.roles?.map(({ id }) => id) || [],
        }
        this.selectedUser = user
      } else {
        this.editedUser = clone(CLEAR_USER)
        this.selectedUser = null
      }
    },

    async saveUser() {
      this.$accessor.startLoading()

      // Metadata can be saved only after user is created
      if (!this.isNewUser(this.editedUser)) await this.saveMetadata(this.editedUser.id)

      const updated = this.isNewUser(this.editedUser)
        ? await this.$accessor.users.add(this.editedUser)
        : await this.$accessor.users.update({
            id: this.editedUser.id,
            item: this.editedUser,
          })

      if (updated && updated?.id === this.$accessor.auth.user?.id) {
        this.$accessor.auth.SET_USER(updated)
      }

      this.$accessor.stopLoading()
    },
    async deleteItem() {
      if (this.isNewUser(this.editedUser)) return

      this.$accessor.startLoading()
      await this.$accessor.users.remove(this.editedUser.id)
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
  },
})
</script>