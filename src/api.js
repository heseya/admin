import axios from 'axios'
import store from './store/index'
import router from './router'

const getApiURL = () => {
  switch (window.location.host) {
    case 'admin.trafika.bydgoszcz.pl':
      return 'https://trafika.***REMOVED***'
    case 'admin.depth.store':
      return '***REMOVED***'
    case '***REMOVED***-admin.heseya.com':
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin.***REMOVED***.pl':
      return 'https://***REMOVED***.***REMOVED***'
    default:
      return 'https://dev.***REMOVED***'
  }
}

export const api = axios.create({
  baseURL: getApiURL()
})

api.interceptors.request.use((config) => {
  const token = store.getters['auth/getToken']

  if (token != null) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    store.dispatch('auth/logout')
    router.push('/login')
  }
  throw error
})
