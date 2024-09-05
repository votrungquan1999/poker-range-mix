import { MongoClient } from 'mongodb'
import setup from '../asynclocal'
import { memoize } from 'lodash'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'

async function newMongoDB() {
  const client = MongoClient.connect(MONGODB_URI)

  return client
}

const asyncContext = setup(memoize(newMongoDB))

export function getMongoDb() {
  return asyncContext.get().db()
}

export function getMongoDbClient() {
  return asyncContext.get()
}

export const injectMongoDB = asyncContext.inject
