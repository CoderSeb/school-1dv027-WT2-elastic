import { loadClient } from './loadClient.js'
import { testElastic } from './testElastic.js'

/**
 * Function to create index and populate elasticsearch with the data fetched from the api.
 *
 * @param {Object[]} data as the data to be indexed on elasticsearch.
 */
export const populateElastic = async (data) => {
  console.log('Testing connection to Elasticsearch...')
  await testElastic()
  const client = loadClient()
  const index = 'stocksdata'
  try {
    console.log('Creating index...')
    await client.indices.create({
      index: index
    })
  } catch (e) {
    console.log(`Index ${index} already exists.`)
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
