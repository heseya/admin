import { AxiosError } from 'axios'
import isEmpty from 'lodash/isEmpty'
import i18n from '@/i18n'
import { formatApiNotification } from './utils'

enum ErrorType {
  ValidationError = 'VALIDATION_ERROR',
  ClientError = 'CLIENT_ERROR',
  ServerError = 'SERVER_ERROR',
}

//TODO: Replace with implementation from @heseya/store-core
export type ApiError = AxiosError<{
  message?: string
  error: {
    key: string
    code: number
    message: string
    errors: Record<string, { key: string; message: string; [key: string]: string }[]>
  }
}>

const getErrorType = (errorKey: string, statusCode: number) => {
  if (errorKey === ErrorType.ValidationError) return ErrorType.ValidationError
  else if (statusCode >= 400 && statusCode < 500) return ErrorType.ClientError
  else if (statusCode >= 500) return ErrorType.ServerError
}

export const formatApiError = (error: ApiError) => {
  const responseData = error.response?.data?.error
  const responseStatus = error.response?.status
  const errorCode = responseData?.code
  const errorType = getErrorType(responseData?.key as string, errorCode as number)

  if (error.code === 'ERR_NETWORK') {
    return { title: i18n.t('errors.CLIENT_ERROR.ERR_NETWORK') as string, messages: [] }
  }

  if (responseStatus === 500) {
    return { title: i18n.t('errors.SERVER_ERROR.INTERNAL_SERVER_ERROR') as string, messages: [] }
  }

  const fallbackMessage = i18n.t(`errors.${errorType}.${responseData?.key}`) as string

  const messages = !isEmpty(responseData?.errors)
    ? Object.entries(responseData?.errors!)
        .map(([key, value]) => {
          const fieldName = (
            i18n.te(`common.form.${key}`) ? (i18n.t(`common.form.${key}`) as string) : key
          ).toLowerCase()

          const errorKey = value[0].key
          return errorKey
            ? `${i18n.t('errors.field')} <b>"${fieldName}"</b>: ` +
                i18n.t(`errors.${errorType}.${errorKey}`, value[0])
            : ''
        })
        .filter(Boolean)
    : [fallbackMessage]

  return {
    title: i18n.te(`errors.ERROR_TYPES.${errorType}`)
      ? (i18n.t(`errors.ERROR_TYPES.${errorType}`) as string)
      : (i18n.t(`errors.SERVER_ERROR.INTERNAL_SERVER_ERROR`) as string),
    messages: messages.length ? messages : [fallbackMessage],
  }
}

export const formatApiNotificationError = (error: ApiError) => {
  const { title, messages } = formatApiError(error)
  return formatApiNotification(title, ...messages)
}
