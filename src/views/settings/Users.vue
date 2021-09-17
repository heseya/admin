<template>
  <div>
    <PaginatedList title="Użytkownicy" store-key="users">
      <template #nav>
        <icon-button v-can="$p.Users.Add" @click="openModal()">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj użytkownika
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
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="isNewUser(editedUser) ? 'Nowy użytkownik' : 'Edycja użytkownika'"
      >
        <UserForm v-model="editedUser" :disabled="!canModify" />

        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)"> Zapisz </app-button>
            <pop-confirm
              v-can="$p.Users.Remove"
              title="Czy na pewno chcesz usunąć tego użytkownika?"
              ok-text="Usuń"
              cancel-text="Anuluj"
              @confirm="deleteItem"
            >
              <app-button
                v-if="!isNewUser(editedUser)"
                :disabled="isEditedUserCurrentUser"
                type="danger"
              >
                Usuń
              </app-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import UserForm from '@/components/modules/users/Form.vue'
import Avatar from '@/components/layout/Avatar.vue'

import { UUID } from '@/interfaces/UUID'
import { CreateUserDTO, EditUserDTO } from '@/interfaces/User'

const CLEAR_USER: CreateUserDTO = {
  name: '',
  email: '',
  password: '',
  roles: [],
}

export default Vue.extend({
  metaInfo: { title: 'Użytkownicy' },
  components: {
    PaginatedList,
    ListItem,
    UserForm,
    PopConfirm,
    ValidationObserver,
    Avatar,
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
      } else {
        this.editedUser = clone(CLEAR_USER)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()

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
  },
})
</script>
