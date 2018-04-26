import puppeteer from 'puppeteer'
import { database } from '../client/firebase'

import config from '../config'

const pushToDatabase = data => {
  const ref = database.ref(`data/${config.YOUR_UNIQUE_GOOGLE_AUTH_ID}/`)
  const newRef = ref.push()
  newRef.set({
    date: new Date().toString(),
    ...data
  })
}

const getPageMetrics = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.waitFor(1000)
  await page.goto('https://ao.com')

  const perf = await page.evaluate(_ => {
    const { loadEventEnd, navigationStart } = performance.timing

    return {
      firstPaint: chrome.loadTimes().firstPaintTime * 1000 - navigationStart,
      loadTime: loadEventEnd - navigationStart
    }
  })

  console.log(`First paint in ${perf.firstPaint}ms`)
  console.log(`Load time ${perf.loadTime}ms`)

  pushToDatabase({
    firstPaint: perf.firstPaint,
    loadTime: perf.loadTime
  })

  await browser.close()
}

getPageMetrics()
