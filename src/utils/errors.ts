import { AxiosError } from 'axios'
import { formatApiNotification } from './utils'

export const formatApiError = (error: AxiosError) => {
  const responseData = error.response?.data

  return {
    title: (responseData?.error?.message || error.message) as string,
    text: (Object.values(responseData?.error?.errors || {})[0] as string) || '',
  }
}

export const formatApiNotificationError = (error: AxiosError) => {
  return formatApiNotification(formatApiError(error))
}
