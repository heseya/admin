<template>
  <div>
    <PaginatedList title="Użytkownicy" storeKey="users">
      <template #nav>
        <vs-button v-can="$p.Users.Add" @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>
      <template v-slot="{ item: user }">
        <list-item @click="openModal(user.id)" :key="user.id">
          <template #avatar>
            <vs-avatar>
              <img :src="user.avatar" alt="" />
            </vs-avatar>
          </template>
          {{ user.name }}
          <small>{{ user.roles.map((r) => r.name).join(', ') }}</small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ isNewUser(editedUser) ? 'Nowy użytkownik' : 'Edycja użytkownika' }}</h4>
        </template>

        <UserForm :disabled="!canModify" v-model="editedUser" />

        <template #footer>
          <div class="row">
            <vs-button v-if="canModify" color="dark" @click="handleSubmit(saveModal)">
              Zapisz
            </vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć tego użytkownika?"
              v-can="$p.Users.Remove"
              okText="Usuń"
              cancelText="Anuluj"
              @confirm="deleteItem"
              v-slot="{ open }"
            >
              <vs-button
                v-if="!isNewUser(editedUser)"
                :disabled="isEditedUserCurrentUser"
                color="danger"
                @click="open"
              >
                Usuń
              </vs-button>
            </pop-confirm>
          </div>
        </template>
      </vs-dialog>
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

import { UUID } from '@/interfaces/UUID'
import { CreateUserDTO, EditUserDTO } from '@/interfaces/User'

const CLEAR_USER: CreateUserDTO = {
  name: '',
  email: '',
  password: '',
  roles: [],
}

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
    UserForm,
    PopConfirm,
    ValidationObserver,
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
  beforeRouteLeave(_to, _from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
})
</script>
