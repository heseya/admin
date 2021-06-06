import format from 'date-fns/format'

/**
 * Returns last element of the given array
 * @param {Array} array
 * @returns {*}
 */
export const getLastElement = (array) => array[array.length - 1]

const getDaysDiff = (d1, d2) => {
  const diff = new Date(+d2).setHours(12) - new Date(+d1).setHours(12)
  return Math.round(diff / 8.64e7) || 0
}

const getMinutesDiff = (d1, d2) => {
  const diff = new Date(d2).getTime() - new Date(+d1).getTime()
  return Math.round(diff / 1000 / 60) || 0
}

export const getRelativeDate = (date, lang = 'pl') => {
  const today = new Date()
  const actionDate = new Date(date)

  const diff = getDaysDiff(today, actionDate)
  const minutesDiff = getMinutesDiff(today, actionDate)

  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })

  if (diff > -1 && minutesDiff < -59) return rtf.format(Math.round(minutesDiff / 60), 'hours')
  if (diff > -1) return rtf.format(minutesDiff, 'minute')
  if (diff > -30) return rtf.format(diff, 'day')
  else if (diff > -356) return rtf.format(parseInt(diff / 30), 'month')
  else return rtf.format(parseInt(diff / 365), 'year')
}

export const formatDate = (date) => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm:ss') + ' / ' + date
}
