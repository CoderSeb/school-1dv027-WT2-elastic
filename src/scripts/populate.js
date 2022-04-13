import { Client } from '@elastic/elasticsearch'
import fs from 'fs-extra'
const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD
  },
  tls: {
    ca: fs.readFileSync(`${process.env.CERT_PATH}`),
    rejectUnauthorized: false
  }
})

export const populateElastic = async (data) => {
  const index = 'stocksdata'
  try {
    await client.indices.create({
      index: index
    })
  } catch (e) {
    console.log(`Index ${index} already exists`)
  }

  const body = addIndex(data, index)

  const bulkResponse = await client.bulk({
    refresh: true,
    body
  })

  if (bulkResponse.errors) {
    throw new Error('Ops! Something went wrong!')
  }

  const count = await client.count({ index: index })
  if (count.count > 0) {
    console.log(`Index ${index} has ${count.count} documents`)
  }
}

const addIndex = (data, index) => {
  const indexedData = data.flatMap(obj => [
    {index: {
      _index: index,
      _id: obj.id
    }}, obj
  ])
  return indexedData
}
