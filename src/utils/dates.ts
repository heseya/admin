import { format } from 'date-fns'

export type DateInput = string | number | Date

export const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm"

export const formatUTC = (date?: DateInput) => (date ? new Date(date).toUTCString() : undefined)

export const formatDate = (date?: DateInput, pattern = 'yyyy-MM-dd HH:mm') =>
  date ? format(new Date(date), pattern) : null
