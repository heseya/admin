import axios, { AxiosError } from 'axios'
import { isNull } from 'lodash'

import { accessor } from './store/index'
import router from './router'
import { getApiURL } from './utils/api'

export const createApiInstance = (baseURL: string, useAccessToken = true) => {
  const apiInstance = axios.create({ baseURL })

  apiInstance.interceptors.request.use((config) => {
    const token = useAccessToken ? accessor.auth.getAccessToken : accessor.auth.getIdentityToken

    if (!isNull(token)) {
      config.headers.Authorization = `Bearer ${token}`
      config.headers['x-language'] = 'pl'
    }

    return config
  })

  apiInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
    if (error.response?.status === 403) {
      accessor.auth.setPermissionsError(error.response.data)
    }

    if (error.response?.status === 401 && !error.request.url?.includes('auth')) {
      const { accessToken, identityToken } = await accessor.auth.refreshToken()

      const token = useAccessToken ? accessToken : identityToken

      error.config.headers = {
        ...(error.config?.headers || {}),
        Authorization: `Bearer ${token}`,
      }

      // ? If refreshed sucessfully, retry last request
      if (token) return apiInstance.request(error.config)

      // ? If not, logout & redirect to login
      accessor.auth.clearAuth()
      accessor.stopLoading()
      router.push('/login')
    }

    throw error
  })

  return apiInstance
}

export const api = createApiInstance(getApiURL())
