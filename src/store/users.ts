import { User, UserCreateDto, UserUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'
import { DefaultVuexMutation } from '@/interfaces/VuexGenerator'
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
        // TODO: state.data type should be inferred from the createVuexCRUD (see TODO in `generator.ts`)
        const user = (state.data as User[]).find((u) => u.id === userId)

        if (!user) throw new Error('User not found')

        commit(DefaultVuexMutation.EditData, {
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
