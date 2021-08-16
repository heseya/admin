import axios, { AxiosError } from 'axios'
import { isNull } from 'lodash'

import { accessor } from './store/index'
import router from './router'

const getApiURL = () => {
  switch (window.location.host) {
    case '***REMOVED***':
      return '***REMOVED***'
    case 'admin.***REMOVED***.pl':
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin.***REMOVED***.eu':
      return 'https://***REMOVED***.***REMOVED***'
    case '***REMOVED***-admin.heseya.com':
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin.***REMOVED***.eu':
      return 'https://***REMOVED***.***REMOVED***'
    default:
      return process.env.VUE_APP_API_URL || 'https://dev.***REMOVED***'
  }
}

export const api = axios.create({
  baseURL: getApiURL(),
})

api.interceptors.request.use((config) => {
  const token = accessor.auth.getToken

  if (!isNull(token)) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['x-language'] = 'pl'
  }

  return config
})

api.interceptors.response.use(undefined, (error: AxiosError) => {
  if (error.response?.status === 403) {
    accessor.auth.setPermissionsError(error.response.data)
  }

  if (error.response?.status === 401) {
    accessor.auth.clearAuth()
    accessor.stopLoading()
    router.push('/login')
  }
  throw error
})
