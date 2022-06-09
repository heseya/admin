import { ALL_FILTER_VALUE } from '../consts/filters'
import { DateInput } from './dates'

/**
 * Returns last element of the given array
 */
export const getLastElement = <T>(array: T[] = []) => (array ? array[array.length - 1] : undefined)

export const getDaysDiff = (d1: DateInput, d2: DateInput) => {
  const diff = new Date(d2).setHours(12) - new Date(d1).setHours(12)
  return Math.round(diff / 8.64e7) || 0
}

export const getMinutesDiff = (d1: DateInput, d2: DateInput) => {
  const diff = new Date(d2).getTime() - new Date(+d1).getTime()
  return Math.round(diff / 1000 / 60) || 0
}

export const getRelativeDate = (date: DateInput, lang = 'pl') => {
  const today = new Date()
  const actionDate = new Date(date)

  const diff = getDaysDiff(today, actionDate)
  const minutesDiff = getMinutesDiff(today, actionDate)

  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })

  if (diff > -1 && minutesDiff < -59) return rtf.format(Math.round(minutesDiff / 60), 'hours')
  if (diff > -1) return rtf.format(minutesDiff, 'minute')
  if (diff > -30) return rtf.format(diff, 'day')
  else if (diff > -356) return rtf.format(Math.floor(diff / 30), 'month')
  else return rtf.format(Math.floor(diff / 365), 'year')
}

export const formatFilters = (filters: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => {
      if (Array.isArray(v)) return v.filter((x) => x !== ALL_FILTER_VALUE).length > 0
      return v !== ALL_FILTER_VALUE && v !== ''
    }),
  )
}

export const formatApiNotification = ({ title, text }: { title: string; text?: string }) => {
  return text
    ? `
  <span class="notification__title">${title}</span>
  <span class="notification__text">${text}</span>
  `
    : title
}
