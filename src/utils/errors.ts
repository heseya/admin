import { AxiosError } from 'axios'
import isEmpty from 'lodash/isEmpty'
import i18n from '@/i18n'
import { formatApiNotification } from './utils'

enum ErrorType {
  ValidationError = 'VALIDATION_ERROR',
  ClientError = 'CLIENT_ERROR',
  ServerError = 'SERVER_ERROR',
}

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
  const responseData = error.response?.data.error
  const errorCode = responseData?.code
  const errorType = getErrorType(responseData?.key as string, errorCode as number)

  const messages = !isEmpty(responseData?.errors)
    ? Object.entries(responseData?.errors!).map(([key, value]) => {
        const fieldName = i18n.te(`common.form.${key}`) ? i18n.t(`common.form.${key}`) : key
        const errorKey = value[0].key
        return fieldName + ': ' + i18n.t(`errors.${errorType}.${errorKey}`, value[0])
      })
    : [i18n.t(`errors.${errorType}.${responseData?.key}`) as string]

  return {
    title: i18n.t(`errors.ERROR_TYPES.${errorType}`) as string,
    messages: messages,
  }
}

export const formatApiNotificationError = (error: ApiError) => {
  return formatApiNotification(formatApiError(error))
}
