import { createVuexCRUD, StoreMutations } from './generator'

import { Role, RoleDTO } from '@/interfaces/Role'
import { PermissionObject } from '@/interfaces/Permissions'
import { api } from '@/api'

export const roles = createVuexCRUD<Role, RoleDTO, RoleDTO>()('roles', {
  state: {
    permissions: [] as PermissionObject[],
  },
  getters: {},
  mutations: {
    SET_PERMISSIONS(state, permissions: PermissionObject[]) {
      state.permissions = permissions
    },
  },
  actions: {
    async fetchPermissions({ commit }) {
      commit(StoreMutations.SetLoading, true)
      try {
        const response = await api.get<{ data: PermissionObject[] }>('/permissions')
        commit('SET_PERMISSIONS', response.data.data)
        commit(StoreMutations.SetError, null)
      } catch (e) {
        commit(StoreMutations.SetError, e)
      }
      commit(StoreMutations.SetLoading, false)
    },
  },
})
