<template>
  <div class="narrower-page">
    <top-nav
      :title="isNewUser(editedUser) ? $t('newTitle').toString() : $t('editTitle').toString()"
    >
      <icon-button v-if="selectedUser" @click="resetPassword">
        <template #icon>
          <i class="bx bxs-shield-plus"></i>
        </template>
        {{ $t('resetPassword') }}
      </icon-button>
    </top-nav>

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
              type="private"
              model="users"
            />
            <MetadataForm
              v-if="selectedUser.metadata_personal"
              ref="personalMeta"
              :value="selectedUser.metadata_personal"
              :disabled="!canModify"
              type="personal"
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
              :title="$t('deleteText').toString()"
              :ok-text="$t('common.delete').toString()"
              :cancel-text="$t('common.cancel').toString()"
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
    "deleteText": "Czy na pewno chcesz usunąć tego użytkownika?",
    "resetPassword": "Zresetuj hasło użytkownika",
    "resetPasswordSuccess": "Mail z linkiem do zresetowania hasła został wysłany na adres email użytkownika.",
    "messages": {
      "removed": "Użytkownik został usunięty.",
      "created": "Użytkownik został utworzony.",
      "updated": "Użytkownik został zaktualizowany."
    }
  },
  "en": {
    "editTitle": "Edit user",
    "newTitle": "New user",
    "deleteText": "Are you sure you want to delete this user?",
    "resetPassword": "Reset user password",
    "resetPasswordSuccess": "Mail with link to reset password has been sent to user's email address.",
    "messages": {
      "removed": "User has been removed.",
      "created": "User has been created.",
      "updated": "User has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'
import { User, UserCreateDto, UserUpdateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import UserForm from '@/components/modules/users/Form.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { UUID } from '@/interfaces/UUID'
import Card from '@/components/layout/Card.vue'
import { formatApiNotificationError } from '@/utils/errors'

const CLEAR_USER: UserCreateDto = {
  name: '',
  email: '',
  password: '',
  roles: [],
}

type UserForm = UserCreateDto | (UserUpdateDto & { id: UUID })

const mapUserToEditableUser = (user: User): UserForm => ({
  ...user,
  roles: user.roles?.map(({ id }) => id) || [],
  birthday_date: user.birthday_date ?? undefined,
  phone: user.phone ?? undefined,
  password: '',
})

export default defineComponent({
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
    editedUser: clone(CLEAR_USER) as UserForm,
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
    '$accessor.users.error'(error) {
      if (error) this.$toast.error(formatApiNotificationError(error))
    },
  },

  methods: {
    async fetchUser() {
      const id = this.$route.params.id === 'create' ? undefined : this.$route.params.id

      if (!this.$verboseCan(this.$p.Users.ShowDetails)) return

      if (id) {
        const user = await this.$accessor.users.get(id)
        if (!user) return this.$router.replace('/settings/users/create')

        this.editedUser = mapUserToEditableUser(user)
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
            item: {
              ...this.editedUser,
              // @ts-ignore
              password: undefined,
              phone_country: undefined,
              phone_number: undefined,
            },
          })

      if (updated) {
        const successMessage = this.isNewUser(this.editedUser)
          ? (this.$t('messages.created') as string)
          : (this.$t('messages.updated') as string)
        this.$toast.success(successMessage)

        this.editedUser = mapUserToEditableUser(updated)
        this.selectedUser = updated

        if (updated.id !== this.$route.params.id) {
          this.$router.push(`/settings/users/${updated.id}`)
        }
      }

      if (updated && updated?.id === this.$accessor.auth.user?.id) {
        this.$accessor.auth.SET_USER(updated)
      }

      this.$accessor.stopLoading()
    },

    async deleteItem() {
      if (this.isNewUser(this.editedUser)) return

      this.$accessor.startLoading()
      const success = await this.$accessor.users.remove(this.editedUser.id)
      if (success) {
        this.$toast.success(this.$t('messages.removed') as string)
        this.$router.push('/settings/users')
      }
      this.$accessor.stopLoading()
    },

    async resetPassword() {
      if (!this.selectedUser) return

      this.$accessor.startLoading()
      const success = await this.$accessor.auth.requestResetPassword({
        email: this.selectedUser.email,
      })
      if (success) {
        this.$toast.success(this.$t('resetPasswordSuccess') as string)
      }
      this.$accessor.stopLoading()
    },

    isNewUser(user: UserCreateDto | (UserUpdateDto & { id: UUID })): user is UserCreateDto {
      return 'id' in user === false
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.personalMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
  },
})
</script>
