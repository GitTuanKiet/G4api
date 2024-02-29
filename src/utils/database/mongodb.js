/* eslint-disable no-useless-catch */
/* eslint-disable no-console */
import { MongoClient, ServerApiVersion } from 'mongodb'
import DB_CONFIG from 'config/db.config'

const { MONGO_URL, MONGO_DB } = DB_CONFIG

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
    throw error
  }
}

export const disconnectMongo = async () => {
  try {
    await clientMongo.close()
    console.log('Disconnected successfully to server')
  } catch (error) {
    throw error
  }
}

export const getMongo = () => {
  if (!dbInstance) throw new Error('You must connect to the database first!')
  return dbInstance
}
