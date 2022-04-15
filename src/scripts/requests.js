import fetch from 'node-fetch'
import symbols from './symbols.js'

/**
 * Request function to fetch data from the Alpha Advantage API.
 *
 * @returns {Object[]}  Array of objects containing the time series data.
 */
export const dailyRequest = async () => {
  let timeSeries = []
  const url = new URL(process.env.ALPHA_API_URL)
  for (let i = 0; i < symbols.length; i++) {
    if (i % 5 === 0 && i !== 0) {
      console.log('Sleeping for one minute...')
      await sleeper(61000) // Api limit is 5 requests per minute.
      console.log('Moving on!')
    }
    console.log(`Fetching data for ${symbols[i]}`)
    const params = {
      function: 'TIME_SERIES_DAILY',
      symbol: symbols[i],
      outputsize: 'full',
      datatype: 'json',
      apikey: process.env.ALPHA_API_KEY
    }
    url.search = new URLSearchParams(params)

    const response = await fetch(url.toString())
    console.log(response.status)
    if (response.message) {
      throw new Error(response.message)
    }
    const data = await response.json()
    let days = []
    for (const [key, value] of Object.entries(data['Time Series (Daily)'])) {
      const day = {
        id: `${data['Meta Data']['2. Symbol']}--${key}`,
        symbol: data['Meta Data']['2. Symbol'],
        date: new Date(key),
        open: parseInt(value['1. open']),
        high: parseInt(value['2. high']),
        low: parseInt(value['3. low']),
        close: parseInt(value['4. close']),
        volume: parseInt(value['5. volume'])
      }
      days.push(day)
    }

    timeSeries.push(...days)
    console.log(`Data for ${symbols[i]} added to workbench.`)
    console.log(`${timeSeries.length} entries in workbench.`)
  }
  return timeSeries
}

/**
 * Sleeper function.
 *
 * @param {number} time as the time in milliseconds.
 * @return {Promise<any>} resolved when time has passed.
 */
const sleeper = async (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
