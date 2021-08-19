<template>
  <div>
    <top-nav :title="!isNew ? role.name : 'Nowa rola'">
      <pop-confirm
        v-if="!isNew"
        title="Czy na pewno chcesz usunąć tą rolę?"
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

    <div class="page">
      <RolesForm v-model="form" @submit="save" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import TopNav from '@/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RolesForm from '@/components/modules/roles/Form.vue'

import { formatApiError } from '@/utils/errors'
import { Role, RoleDTO } from '@/interfaces/Role'
import { accessor } from '@/store'

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
  data() {
    return {
      form: cloneDeep(CLEAN_FORM),
    }
  },
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    role(): Role {
      return accessor.roles.getSelected
    },
    error(): any {
      return accessor.roles.getError
    },
    isLoading(): boolean {
      return accessor.roles.isLoading
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
      accessor.startLoading()
      if (this.isNew) {
        const role = await accessor.roles.add(this.form)
        if (role && role.id) {
          this.$vs.notification({
            color: 'success',
            title: 'Rola została utworzona.',
          })
          this.$router.push(`/settings/roles/${role.id}`)
        }
      } else {
        const success = await accessor.roles.update({
          id: this.id,
          item: this.form,
        })
        if (success) {
          this.$vs.notification({
            color: 'success',
            title: 'Rola została zaktualizowana.',
          })
        }
      }
      accessor.stopLoading()
    },
    async deletePage() {
      accessor.startLoading()
      const success = await accessor.roles.remove(this.id)
      if (success) {
        this.$vs.notification({
          color: 'success',
          title: 'Rola została usunięta.',
        })
        this.$router.push('/settings/roles')
      }
      accessor.stopLoading()
    },
  },
  async created() {
    if (!this.isNew) {
      accessor.startLoading()
      await accessor.roles.get(this.id)
      accessor.stopLoading()
    }
  },
})
</script>

<style lang="scss">
.page__info {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 30px 30px 20px;
  row-gap: 20px;
  margin-top: 15px;

  input {
    width: 100%;
  }

  .vs-select-content {
    max-width: none;
  }
}

@media (min-width: $break) {
  .page__info {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 20px;
    grid-template-rows: 1fr;
    row-gap: 0;
  }
}
</style>
