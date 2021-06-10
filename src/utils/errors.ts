import { AxiosError } from 'axios'

export const formatApiError = (error: AxiosError) => {
  const responseData = error.response?.data

  return {
    title: responseData?.message || error.message,
    text: Object.values(responseData?.errors || {})[0] || '',
  }
}
