<template>
  <div>
    <top-nav :title="!isNew ? role.name : 'Nowa rola'">
      <pop-confirm
        v-if="!isNew"
        title="Czy na pewno chcesz usunąć tą rolę?"
        v-can="$p.Roles.Remove"
        okText="Usuń"
        cancelText="Anuluj"
        @confirm="deletePage"
        v-slot="{ open }"
      >
        <vs-button dark icon @click="open">
          <i class="bx bx-trash"></i>
        </vs-button>
      </pop-confirm>
    </top-nav>

    <RolesForm
      v-model="form"
      @submit="save"
      :disabled="isNew ? !$can($p.Roles.Add) : !$can($p.Roles.Edit)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RolesForm from '@/components/modules/roles/Form.vue'

import { formatApiError } from '@/utils/errors'
import { Role, RoleDTO } from '@/interfaces/Role'

const CLEAN_FORM: RoleDTO = {
  name: '',
  description: '',
  permissions: [],
}

export default Vue.extend({
  components: {
    TopNav,
    PopConfirm,
    RolesForm,
  },
  data: () => ({
    form: cloneDeep(CLEAN_FORM),
  }),
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    role(): Role {
      return this.$accessor.roles.getSelected
    },
    error(): any {
      return this.$accessor.roles.getError
    },
    isLoading(): boolean {
      return this.$accessor.roles.isLoading
    },
  },
  watch: {
    role(role: Role) {
      if (!this.isNew) {
        this.form = cloneDeep(role)
      }
    },
    error(error: any) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
      }
    },
  },
  methods: {
    async save() {
      this.$accessor.startLoading()
      const successMessage = this.isNew ? 'Rola została utworzona' : 'Rola została zaktualizowana'

      const role = this.isNew
        ? await this.$accessor.roles.add(this.form)
        : await this.$accessor.roles.update({ id: this.id, item: this.form })

      if (role && this.$accessor.auth.hasRole(role.id)) {
        await this.$accessor.auth.fetchProfile()
      }

      if (role) {
        this.$vs.notification({
          color: 'success',
          title: successMessage,
        })
      }

      if (role && role.id !== this.id) this.$router.push(`/settings/roles/${role.id}`)

      this.$accessor.stopLoading()
    },
    async deletePage() {
      this.$accessor.startLoading()
      const success = await this.$accessor.roles.remove(this.id)
      if (success) {
        this.$vs.notification({
          color: 'success',
          title: 'Rola została usunięta.',
        })
        this.$router.push('/settings/roles')
      }
      this.$accessor.stopLoading()
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.roles.get(this.id)
      this.$accessor.stopLoading()
    }
  },
})
</script>
