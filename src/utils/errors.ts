import { AxiosError } from 'axios'

export const formatApiError = (error: AxiosError) => ({
  title: error.response?.data?.message || error.message,
  text: Object.values(error.response?.data?.errors || {})[0] || '',
})
