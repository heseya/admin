<template>
  <div class="narrower-page">
    <top-nav :title="!isNew ? role.name : $t('newTitle').toString()">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Roles.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deleteRole"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <RolesForm v-model="form" :disabled="isDisabled" @submit="save">
      <template v-if="selectedRole">
        <MetadataForm
          ref="publicMeta"
          :value="selectedRole.metadata"
          :disabled="isDisabled"
          model="roles"
        />
        <MetadataForm
          v-if="selectedRole.metadata_private"
          ref="privateMeta"
          :value="selectedRole.metadata_private"
          :disabled="isDisabled"
          type="private"
          model="roles"
        />
      </template>
    </RolesForm>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowa rola",
    "deleteText": "Czy na pewno chcesz usunąć tę rolę?",
    "deletedMessage": "Rola została usunięty.",
    "createdMessage": "Rola została utworzona.",
    "updatedMessage": "Rola została zaktualizowana."
  },
  "en": {
    "newTitle": "New role",
    "deleteText": "Are you sure you want to delete this role?",
    "deletedMessage": "Role has been deleted",
    "createdMessage": "Role has been created",
    "updatedMessage": "Role has been updated"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { Role, RoleCreateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RolesForm from '@/components/modules/roles/Form.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { formatApiNotificationError } from '@/utils/errors'

const CLEAN_FORM: RoleCreateDto = {
  name: '',
  description: '',
  permissions: [],
  is_registration_role: false,
}

export default defineComponent({
  metaInfo(this: any): any {
    const fallback = this.$t('newTitle') as string
    return {
      title: this.isNew ? fallback : this.role?.name || fallback,
    }
  },
  components: {
    TopNav,
    PopConfirm,
    RolesForm,
    MetadataForm,
  },
  data: () => ({
    form: cloneDeep(CLEAN_FORM),
    selectedRole: null as Role | null,
  }),
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    role(): Role {
      return this.$accessor.roles.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.roles.getError
    },
    isLoading(): boolean {
      return this.$accessor.roles.isLoading
    },
    isDisabled(): boolean {
      return this.isNew ? !this.$can(this.$p.Roles.Add) : !this.$can(this.$p.Roles.Edit)
    },
  },
  watch: {
    role(role: Role) {
      if (!this.isNew) {
        this.form = cloneDeep(role)
        this.selectedRole = role
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
      const successMessage = this.isNew
        ? (this.$t('createdMessage') as string)
        : (this.$t('updatedMessage') as string)

      // Metadata can be saved only after role is created
      if (this.selectedRole) await this.saveMetadata(this.selectedRole.id)

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
    async deleteRole() {
      this.$accessor.startLoading()
      const success = await this.$accessor.roles.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/settings/roles')
      }
      this.$accessor.stopLoading()
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
