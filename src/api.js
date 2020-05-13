import axios from 'axios'
import store from './store/index'
import router from './router'

const DEBUG = process.env.NODE_ENV === 'development'

const API_URLS = {
  production: 'https://dev.***REMOVED***',
  local: 'https://dev.***REMOVED***/'
}

const baseURL = DEBUG ? API_URLS.local : API_URLS.production

export const api = axios.create({
  baseURL
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
