import axios from 'axios'

const DEBUG = process.env.NODE_ENV === 'development'

const API_URLS = {
  production: 'https://depth.space',
  local: 'https://depth.space'
}

const baseURL = DEBUG ? API_URLS.local : API_URLS.production

export const api = axios.create({
  baseURL
})
