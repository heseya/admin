/**
 * Returns last element of the given array
 * @param {Array} array
 * @returns {*}
 */
export const getLastElement = (array) => array[array.length - 1]

const getDaysDiff = (d1, d2) => {
  const diff = new Date(+d2).setHours(12) - new Date(+d1).setHours(12)
  return Math.round(diff / 8.64e7)
}

export const getRelativeDate = (date, lang = 'pl') => {
  const today = new Date()
  const actionDate = new Date(date)

  const diff = getDaysDiff(today, actionDate)

  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })

  if (diff > -30) return rtf.format(diff, 'day')
  else if (diff > -356) return rtf.format(parseInt(diff / 30), 'month')
  else return rtf.format(parseInt(diff / 365), 'year')
}
