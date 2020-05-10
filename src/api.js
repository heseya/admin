import axios from 'axios'
import store from './store/index'

const DEBUG = process.env.NODE_ENV === 'development'

const API_URLS = {
  production: 'https://depth.space',
  local: 'https://depth.space'
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
