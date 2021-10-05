<template>
  <div class="narrower-page">
    <top-nav :title="!isNew ? role.name : 'Nowa rola'">
      <changes-history :id="role.id" model="roles" />
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Roles.Remove"
        title="Czy na pewno chcesz usunąć tę rolę?"
        ok-text="Usuń"
        cancel-text="Anuluj"
        @confirm="deletePage"
      >
        <icon-button type="danger">
          <i slot="icon" class="bx bx-trash"></i>
          Usuń
        </icon-button>
      </pop-confirm>
    </top-nav>

    <RolesForm
      v-model="form"
      :disabled="isNew ? !$can($p.Roles.Add) : !$can($p.Roles.Edit)"
      @submit="save"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ChangesHistory from '@/components/ChangesHistory.vue'
import RolesForm from '@/components/modules/roles/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { Role, RoleDTO } from '@/interfaces/Role'

const CLEAN_FORM: RoleDTO = {
  name: '',
  description: '',
  permissions: [],
}

export default Vue.extend({
  metaInfo(): any {
    return { title: this.role?.name || 'Nowa rola' }
  },
  components: {
    TopNav,
    PopConfirm,
    RolesForm,
    ChangesHistory,
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
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.roles.get(this.id)
      this.$accessor.stopLoading()
    }
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
        this.$toast.success(successMessage)
      }

      if (role && role.id !== this.id) this.$router.push(`/settings/roles/${role.id}`)

      this.$accessor.stopLoading()
    },
    async deletePage() {
      this.$accessor.startLoading()
      const success = await this.$accessor.roles.remove(this.id)
      if (success) {
        this.$toast.success('Rola została usunięta.')
        this.$router.push('/settings/roles')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>
