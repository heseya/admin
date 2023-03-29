import { Role, RoleCreateDto, PermissionEntry, RoleUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'
import { DefaultVuexMutation } from '@/interfaces/VuexGenerator'
import { sdk } from '@/api'

export const roles = createVuexCRUD<Role, RoleCreateDto, RoleUpdateDto>()('roles', {
  state: {
    permissions: [] as PermissionEntry[],
  },
  getters: {},
  mutations: {
    SET_PERMISSIONS(state, permissions: PermissionEntry[]) {
      state.permissions = permissions
    },
  },
  actions: {
    async fetchPermissions({ commit }) {
      commit(DefaultVuexMutation.SetLoading, true)
      try {
        const permissions = await sdk.Roles.getPermissions()
        commit('SET_PERMISSIONS', permissions)
        commit(DefaultVuexMutation.SetError, null)
      } catch (e: any) {
        commit(DefaultVuexMutation.SetError, e)
      }
      commit(DefaultVuexMutation.SetLoading, false)
    },
  },
})
