// Source: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-testing.html

import { Client } from '@elastic/elasticsearch'
import Mock from '@elastic/elasticsearch-mock'
import fs from 'fs-extra'

/**
 * Test function taken from the source mentioned above, 
 * simple GET method to check if the connection is alive.
 */
export const testElastic = async () => {
  const mock = new Mock()
  const client = new Client({
    node: process.env.NODE_ENV === 'production' ? process.env.ELASTIC_PRODUCTION_URL : process.env.ELASTIC_DEVELOPMENT_URL,
    auth: { apiKey: process.env.NODE_ENV === 'production' ? process.env.ELASTIC_PRODUCTION_KEY : process.env.ELASTIC_DEVELOPMENT_KEY },
    tls: process.env.NODE_ENV !== 'production' ? { ca: fs.readFileSync(`${process.env.CERT_PATH}`), rejectUnauthorized: false } : {},
    Connection: mock.getConnection()
  })

  mock.add(
    {
      method: 'GET',
      path: '/'
    },
    () => {
      return { status: 'ok' }
    }
  )

  client.info().then(console.log, console.log).catch(error => console.error(error.message))
}

