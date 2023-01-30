import { User, UserCreateDto, UserUpdateDto } from '@heseya/store-core'
import { createVuexCRUD, StoreMutations } from './generator'
import { sdk } from '@/api'
import { UUID } from '@/interfaces/UUID'

export const users = createVuexCRUD<User, UserCreateDto, UserUpdateDto>()('users', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async removeUser2FA({ commit, state }, userId: UUID) {
      try {
        await sdk.Users.removeTwoFactorAuth(userId)
        const user = state.data.find((u) => u.id === userId)

        if (!user) throw new Error('User not found')

        commit(StoreMutations.EditData, {
          key: 'id',
          value: user.id,
          item: { ...user, is_tfa_active: false },
        })

        return { success: true }
      } catch (error) {
        return {
          success: false,
          error,
        }
      }
    },
  },
})
