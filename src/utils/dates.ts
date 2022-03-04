import { format } from 'date-fns'

export type DateInput = string | number | Date

export const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm"

export const formatUTC = (date?: DateInput | null) => (date ? new Date(date).toUTCString() : null)

export const formatDate = (date?: DateInput | null, pattern = 'dd.MM.yyyy, HH:mm') =>
  date ? format(new Date(date), pattern) : null
