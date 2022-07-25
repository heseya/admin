import { formatRelative } from 'date-fns'
import { pl, enGB } from 'date-fns/locale'
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

export const getRelativeDate = (date: DateInput, lang = 'pl', pattern = 'dd.MM.yyyy, HH:mm') => {
  const today = new Date()
  const actionDate = new Date(date)

  const baseLocale = lang === 'pl' ? pl : enGB
  const locale = {
    ...baseLocale,
    formatRelative: (token: any, ...args: any[]) =>
      token === 'other' ? pattern : baseLocale.formatRelative!(token, ...args),
  }

  return formatRelative(actionDate, today, { locale })
}

export const formatFilters = (filters: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => {
      if (Array.isArray(v)) return v.filter((x) => x !== ALL_FILTER_VALUE).length > 0
      return v !== ALL_FILTER_VALUE && v !== '' && v !== 0
    }),
  )
}

export const formatApiNotification = (title: string, ...messages: string[]) => {
  return messages
    ? `
  <span class="notification__title">${title}</span>

  ${messages.map((msg) => `<span class="notification__text">${msg}</span>`).join('')}
  `
    : title
}
