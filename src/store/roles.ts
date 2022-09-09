import { Role, RoleCreateDto, PermissionEntry } from '@heseya/store-core'
import { createVuexCRUD } from './generator'
import { StoreMutations } from '@/interfaces/VuexGenerator'
import { sdk } from '@/api'

export const roles = createVuexCRUD<Role, RoleCreateDto, RoleCreateDto>()('roles', {
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
      commit(StoreMutations.SetLoading, true)
      try {
        const permissions = await sdk.Roles.getPermissions()
        commit('SET_PERMISSIONS', permissions)
        commit(StoreMutations.SetError, null)
      } catch (e: any) {
        commit(StoreMutations.SetError, e)
      }
      commit(StoreMutations.SetLoading, false)
    },
  },
})
