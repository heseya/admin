import { format } from 'date-fns'

export type DateInput = string | number | Date

export const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm"

export const FULLDATE_FORMAT = 'dd.MM.yyyy, HH:mm'
export const THIS_YEAR_DATE_FORMAT = 'dd.MM, HH:mm'

export const HOURLESS_FULLDATE_FORMAT = 'dd.MM.yyyy'
export const HOURLESS_THIS_YEAR_DATE_FORMAT = 'dd.MM'

export const formatUTC = (date?: DateInput | null) => (date ? new Date(date).toUTCString() : null)

export const formatDate = (date?: DateInput | null, showHour = true) => {
  if (!date) return null
  const isCurrentYear = new Date().getFullYear() === new Date(date).getFullYear()
  return isCurrentYear
    ? format(new Date(date), showHour ? THIS_YEAR_DATE_FORMAT : HOURLESS_THIS_YEAR_DATE_FORMAT)
    : format(new Date(date), showHour ? FULLDATE_FORMAT : HOURLESS_FULLDATE_FORMAT)
}

export const formatDateTimeInput = (date?: DateInput | null) =>
  date ? format(new Date(date), DATETIME_FORMAT) : null
