import dotenv from 'dotenv'
import { dailyRequest } from './scripts/requests.js'
dotenv.config()

const app = async () => {
  const timeSeries = await dailyRequest()
  console.log(timeSeries)
}

try {
  await app()
} catch (e) {
  console.error(e.message)
}