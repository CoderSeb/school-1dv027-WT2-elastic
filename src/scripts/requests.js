import fetch from 'node-fetch'
import symbols from './symbols.js'
export const dailyRequest = async () => {
  let timeSeries = []
  const url = new URL(process.env.ALPHA_API_URL)
  const params = {
    function: 'TIME_SERIES_DAILY',
    symbol: symbols[0],
    outputsize: 'full',
    datatype: 'json',
    apikey: process.env.ALPHA_API_KEY
  }
  url.search = new URLSearchParams(params)

  const response = await fetch(url.toString())
  const data = await response.json()
  let days = []
  for (const [key, value] of Object.entries(data['Time Series (Daily)'])) {
    const day = {
      date: key,
      open: value['1. open'],
      high: value['2. high'],
      low: value['3. low'],
      close: value['4. close'],
      volume: value['5. volume']
    }
    days.push(day)
  }

  let stock = {
    symbol: data['Meta Data']['2. Symbol'],
    lastRefreshed: data['Meta Data']['3. Last Refreshed'],
    timeZone: data['Meta Data']['5. Time Zone'],
    stockPrices: days
  }
  
  timeSeries.push(stock)

  return timeSeries
}