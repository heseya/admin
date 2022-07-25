import { format } from 'date-fns'

export type DateInput = string | number | Date

export const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm"

export const FULLDATE_FORMAT = 'dd.MM.yyyy, HH:mm'

export const formatUTC = (date?: DateInput | null) => (date ? new Date(date).toUTCString() : null)

export const formatDate = (date?: DateInput | null) =>
  date ? format(new Date(date), FULLDATE_FORMAT) : null

export const formatDateTimeInput = (date?: DateInput | null) =>
  date ? format(new Date(date), DATETIME_FORMAT) : null
