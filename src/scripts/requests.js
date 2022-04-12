import fetch from 'node-fetch'
import symbols from './symbols.js'
export const dailyRequest = async () => {
  let timeSeries = []
  const url = new URL(process.env.ALPHA_API_URL)
  for (let i = 0; i < symbols.length; i++) {
    if (i % 2 === 0 && i !== 0) {
      console.log('Sleeping for 15 seconds to not overload the api...')
      await sleeper(15000)
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
        date: key,
        open: parseInt(value['1. open']),
        high: parseInt(value['2. high']),
        low: parseInt(value['3. low']),
        close: parseInt(value['4. close']),
        volume: parseInt(value['5. volume'])
      }
      days.push(day)
    }

    let stock = {
      id: `${data['Meta Data']['2. Symbol']}--${data['Meta Data']['3. Last Refreshed']}--${data['Meta Data']['5. Time Zone']}`,
      symbol: data['Meta Data']['2. Symbol'],
      lastRefreshed: data['Meta Data']['3. Last Refreshed'],
      timeZone: data['Meta Data']['5. Time Zone'],
      stockPrices: days
    }

    timeSeries.push(stock)
    console.log(`Data for ${symbols[i]} added to workbench`)
  }
  return timeSeries
}

const sleeper = async (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
