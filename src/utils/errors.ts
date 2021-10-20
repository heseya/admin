import { AxiosError } from 'axios'
import { formatApiNotification } from './utils'

type ApiError = AxiosError<{ message?: string; error: { message: string; errors: any[] } }>

export const formatApiError = (error: ApiError) => {
  const responseData = error.response?.data

  return {
    title: (responseData?.error?.message || error.message) as string,
    text: (Object.values(responseData?.error?.errors || {})[0] as string) || '',
  }
}

export const formatApiNotificationError = (error: ApiError) => {
  return formatApiNotification(formatApiError(error))
}
