import { format } from 'date-fns'

export const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm"

export const formatUTC = (date?: Date | string | number) =>
  date ? new Date(date).toUTCString() : undefined

export const formatDate = (date?: Date | string | number, pattern = 'yyyy-MM-dd HH:mm') =>
  date ? format(new Date(date), pattern) : null
