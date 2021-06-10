import axios from 'axios'
import store from './store/index'
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
      return 'https://dev.***REMOVED***'
  }
}

export const api = axios.create({
  baseURL: getApiURL(),
})

api.interceptors.request.use((config) => {
  const token = store.getters['auth/getToken']

  if (token != null) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['x-language'] = 'pl'
  }

  return config
})

api.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 401) {
    store.dispatch('auth/clearAuth')
    router.push('/login')
  }
  throw error
})