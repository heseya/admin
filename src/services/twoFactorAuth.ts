import { sdk } from '@/api'
import { TwoFactorAuthMethod } from '@/enums/twoFactorAuth'
import { accessor } from '@/store'
import { AxiosError } from 'axios'

export const initAppTwoFactorAuth = async () => {
  try {
    const data = await sdk.UserProfile.TwoFactorAuthentication.setup(TwoFactorAuthMethod.App)
    return {
      success: true,
      qrCodeUrl: data.qrCodeUrl,
      secret: data.secret,
    } as const
  } catch (e) {
    return {
      success: false,
      error: e as AxiosError,
    } as const
  }
}

export const initEmailTwoFactorAuth = async () => {
  try {
    await sdk.UserProfile.TwoFactorAuthentication.setup(TwoFactorAuthMethod.Email)

    return { success: true } as const
  } catch (e) {
    return {
      success: false,
      error: e as AxiosError,
    } as const
  }
}

export const confirmTwoFactorAuth = async (confirmCode: string) => {
  try {
    const { recoveryCodes } = await sdk.UserProfile.TwoFactorAuthentication.confirm(confirmCode)

    accessor.auth.SET_USER_TFA(true)

    return { success: true, recoveryCodes } as const
  } catch (e) {
    return {
      success: false,
      error: e as AxiosError,
    } as const
  }
}

export const removeTwoFactorAuth = async (password: string) => {
  try {
    await sdk.UserProfile.TwoFactorAuthentication.remove(password)

    accessor.auth.SET_USER_TFA(false)

    return { success: true } as const
  } catch (e) {
    return {
      success: false,
      error: e as AxiosError,
    } as const
  }
}

export const generateRecoveryCodes = async (password: string) => {
  try {
    const { recoveryCodes } = await sdk.UserProfile.TwoFactorAuthentication.generateRecoveryCodes(
      password,
    )

    return { success: true, recoveryCodes } as const
  } catch (e) {
    return {
      success: false,
      error: e as AxiosError,
    } as const
  }
}
