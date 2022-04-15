import { Client } from '@elastic/elasticsearch'
import fs from 'fs-extra'

/**
 * Function to create and elasticsearch Client.
 *
 * @returns {Client} as the elasticsearch client.
 */
export const loadClient = () => {
  const devOptions = {
    node: process.env.ELASTIC_DEVELOPMENT_URL,
    auth: {
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD
     },
    tls: { ca: fs.readFileSync(`${process.env.CERT_PATH}`), rejectUnauthorized: false }
  }

  const prodOptions = {
    node: process.env.ELASTIC_PRODUCTION_URL,
    auth: {
      username: process.env.ELASTIC_PROD_USER,
      password: process.env.ELASTIC_PROD_PASS
     }
  }

  const options = process.env.NODE_ENV === 'production' ? prodOptions : devOptions
  const client = new Client(options)
  return client
}