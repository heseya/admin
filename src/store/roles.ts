import { Role, RoleCreateDto, PermissionEntry } from '@heseya/store-core'
import { createVuexCRUD, StoreMutations } from './generator'
import { api } from '@/api'

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
        const response = await api.get<{ data: PermissionEntry[] }>('/permissions')
        commit('SET_PERMISSIONS', response.data.data)
        commit(StoreMutations.SetError, null)
      } catch (e: any) {
        commit(StoreMutations.SetError, e)
      }
      commit(StoreMutations.SetLoading, false)
    },
  },
})
