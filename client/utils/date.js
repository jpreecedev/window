const formatDate = date => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const theDate = new Date(date)
  const day = theDate.getDate()
  const monthIndex = theDate.getMonth()
  const year = theDate.getFullYear()

  return day + ' ' + monthNames[monthIndex] + ' ' + year
}

export const formatDatesFromData = data =>
  data.map(item => ({
    ...item,
    date: formatDate(item.date)
  }))
