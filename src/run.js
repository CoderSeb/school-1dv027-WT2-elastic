import { populateElastic } from './scripts/populate.js'
import { dailyRequest } from './scripts/requests.js'

/**
 * Entry point of the application.
 */
const app = async () => {
  const timeSeries = await dailyRequest()
  await populateElastic(timeSeries)
}

try {
  await app()
} catch (e) {
  console.error(e.message)
  console.error(e.stack)
}