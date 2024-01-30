/* eslint-disable no-console */
import { MongoClient, ServerApiVersion } from 'mongodb'
import { ENV } from 'config/environment'

const { MONGO_URL, MONGO_DB } = ENV

let dbInstance = null

const clientMongo = new MongoClient(MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: false
  }
})

export const connectMongo = async () => {
  try {
    await clientMongo.connect()
    dbInstance = clientMongo.db(MONGO_DB)
    console.log('Connected successfully to server')
  } catch (error) {
    console.error(error)
  }
}

export const disconnectMongo = async () => {
  try {
    await clientMongo.close()
    console.log('Disconnected successfully to server')
  } catch (error) {
    console.error(error)
  }
}

export const getMongo = () => {
  if (!dbInstance) throw new Error('You must connect to the database first!')
  return dbInstance
}
