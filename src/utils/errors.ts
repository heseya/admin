import { AxiosError } from 'axios'
import { formatApiNotification } from './utils'

export type ApiError = AxiosError<{
  message?: string
  error: { message: string; errors: Record<string, { key: string; message: string }[]> }
}>

export const formatApiError = (error: ApiError) => {
  const responseData = error.response?.data

  return {
    title: (responseData?.error?.message || error.message) as string,
    text:
      Object.values(responseData?.error?.errors || {})
        .flat()
        .map((v) => v.message)
        .join(', ') || '',
  }
}

export const formatApiNotificationError = (error: ApiError) => {
  return formatApiNotification(formatApiError(error))
}
