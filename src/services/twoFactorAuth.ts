import { api } from '@/api'
import { TwoFactorAuthMethod } from '@/enums/twoFactorAuth'
import { accessor } from '@/store'
import { AxiosError } from 'axios'

interface ApiResponse<T> {
  data: T
}

export const initAppTwoFactorAuth = async () => {
  type AppSetupResponse = ApiResponse<{
    type: TwoFactorAuthMethod.App
    secret: string
    // eslint-disable-next-line camelcase
    qr_code_url: string
  }>

  try {
    const { data } = await api.post<AppSetupResponse>('/auth/2fa/setup', {
      type: TwoFactorAuthMethod.App,
    })

    return {
      success: true,
      qrCodeUrl: data.data.qr_code_url,
      secret: data.data.secret,
    } as const
  } catch (e) {
    return {
      success: false,
      error: e as AxiosError,
    } as const
  }
}

export const initEmailTwoFactorAuth = async () => {
  type EmailSetupResponse = ApiResponse<{
    type: TwoFactorAuthMethod.Email
  }>

  try {
    await api.post<EmailSetupResponse>('/auth/2fa/setup', {
      type: TwoFactorAuthMethod.Email,
    })

    return { success: true } as const
  } catch (e) {
    return {
      success: false,
      error: e as AxiosError,
    } as const
  }
}

export const confirmTwoFactorAuth = async (confirmCode: string) => {
  type ConfirmResponse = ApiResponse<{
    // eslint-disable-next-line camelcase
    recovery_codes: string[]
  }>

  try {
    const { data } = await api.post<ConfirmResponse>('/auth/2fa/confirm', {
      code: confirmCode,
    })

    accessor.auth.SET_USER_TFA(true)

    return { success: true, recoveryCodes: data.data.recovery_codes } as const
  } catch (e) {
    return {
      success: false,
      error: e as AxiosError,
    } as const
  }
}
