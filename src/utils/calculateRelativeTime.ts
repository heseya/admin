const formatter = new Intl.RelativeTimeFormat('pl', {
  localeMatcher: 'best fit',
  numeric: 'auto',
  style: 'short',
})

export function calculateRelativeTime(pastTime: number) {
  const timeParts = []
  const triggerDate = new Date(pastTime)
  let diffInMilliSeconds = Math.abs(Date.now() - triggerDate.getTime()) / 1000

  const days = Math.floor(diffInMilliSeconds / 86400)
  diffInMilliSeconds -= days * 86400
  if (days) timeParts.push(formatter.formatToParts(Math.round(-days), 'day'))

  const hours = Math.floor(diffInMilliSeconds / 3600) % 24
  diffInMilliSeconds -= hours * 3600
  if (days) timeParts.push(formatter.formatToParts(Math.round(-hours), 'hours'))

  const minutes = Math.floor(diffInMilliSeconds / 60) % 60
  diffInMilliSeconds -= minutes * 60
  if (days) timeParts.push(formatter.formatToParts(Math.round(-minutes), 'minutes'))

  const stringOfTime = timeParts.reduce((acc, part) => {
    if (part[0].unit !== 'minute') {
      return (acc += part[0].value + part[1].value.slice(0, -5) + ' ')
    }
    return (acc += part[0].value + part[1].value)
  }, '')

  return stringOfTime
}
