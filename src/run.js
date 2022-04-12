import fs from 'fs-extra'
import { populateElastic } from './scripts/populate.js'
import { dailyRequest } from './scripts/requests.js'

const app = async () => {
  const timeSeries = await dailyRequest()
  //const timeSeries = JSON.parse(fs.readFileSync('src/mock/mockedTimeSeries.json'))
  await populateElastic(timeSeries)
}

try {
  await app()
} catch (e) {
  console.error(e.message)
  console.error(e.stack)
}