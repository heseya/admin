import axios, { AxiosError } from 'axios'
import isNull from 'lodash/isNull'

import { accessor } from './store/index'
import router from './router'
import { getApiURL } from './utils/api'

const REFRESH_URL = '/auth/refresh'

type OnRefreshFunction = (
  tokens: { success: true; accessToken: string; identityToken: string } | { success: false },
) => void

export const createApiInstance = (baseURL: string, useAccessToken = true) => {
  const apiInstance = axios.create({ baseURL })

  let isRefreshing = false
  let subscribers: OnRefreshFunction[] = []

  const subscribeTokenRefresh = (cb: OnRefreshFunction) => {
    subscribers.push(cb)
  }

  const onRefreshed: OnRefreshFunction = (tokens) => {
    subscribers.map((cb) => cb(tokens))
  }

  apiInstance.interceptors.request.use((config) => {
    const token = useAccessToken ? accessor.auth.getAccessToken : accessor.auth.getIdentityToken

    if (!isNull(token)) {
      if (config.url !== REFRESH_URL) config.headers.Authorization = `Bearer ${token}`
      config.headers['x-language'] = 'pl'
    }

    return config
  })

  apiInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
    const originalRequest = error.config

    if (error.response?.status === 403) {
      accessor.auth.setPermissionsError(error.response.data)
    }

    // Refreshing the token
    const requestUrl = error.response?.config.url

    if (error.response?.status === 401 && requestUrl !== REFRESH_URL && !originalRequest._retried) {
      // ? This wil prevent the second refresh if request fails twice
      originalRequest._retried = true

      if (!isRefreshing) {
        isRefreshing = true
        accessor.auth.refreshToken().then((refreshedTokens) => {
          isRefreshing = false
          onRefreshed(refreshedTokens)
          subscribers = []
        })
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((refreshedTokens) => {
          // ? If token not refreshed, logout & redirect to login
          if (!refreshedTokens.success) {
            accessor.auth.clearAuth()
            accessor.stopLoading()
            router.push('/login')
            throw error
          }

          const token = useAccessToken ? refreshedTokens.accessToken : refreshedTokens.identityToken
          originalRequest.headers.Authorization = `Bearer ${token}`

          // ? Retry last request
          resolve(apiInstance.request(originalRequest))
        })
      })
    }

    throw error
  })

  return apiInstance
}

export const api = createApiInstance(getApiURL())
