import puppeteer from 'puppeteer'
import { database } from '../client/firebase'

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

  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()

  return day + ' ' + monthNames[monthIndex] + ' ' + year
}

const pushToDatabase = data => {
  const ref = database.ref(`data/`)
  const newRef = ref.push()
  newRef.set({
    date: formatDate(new Date()),
    ...data
  })
}

const getPageMetrics = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.waitFor(1000)
  await page.goto('https://ao.com/c/shoppingbasket.aspx')

  const perf = await page.evaluate(_ => {
    const { loadEventEnd, navigationStart } = performance.timing

    return {
      firstPaint: chrome.loadTimes().firstPaintTime * 1000 - navigationStart,
      loadTime: loadEventEnd - navigationStart
    }
  })

  const response = await page._client.send('Performance.getMetrics')
  const JSUsedSize = response.metrics.find(x => x.name === 'JSHeapUsedSize').value
  const JSTotalSize = response.metrics.find(x => x.name === 'JSHeapTotalSize').value

  const usedJS = Math.round(JSUsedSize / JSTotalSize * 100)

  console.log(`First paint in ${perf.firstPaint}ms`)
  console.log(`Load time ${perf.loadTime}ms`)
  console.log(`${100 - usedJS}% of JS is unused`)

  pushToDatabase({
    firstPaint: perf.firstPaint,
    loadTime: perf.loadTime,
    unusedJs: 100 - usedJS
  })

  await browser.close()
}

getPageMetrics()
