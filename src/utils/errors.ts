import { AxiosError } from 'axios'

export const formatApiError = (error: AxiosError) => {
  const responseData = error.response?.data

  return {
    title: responseData?.error?.message || error.message,
    text: Object.values(responseData?.error?.errors || {})[0] || '',
  }
}
