import { ENV } from 'config/environment'
import path from 'path'

export const DOMAINS = [
  'http://localhost:5173',
  '...'
]

// regex cho objectId mongo
export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_MESSAGE = { 'string.pattern.base': 'Invalid ObjectId' }

// paypal
const getApiUrl = (PATH) => path.join('https://api-m.sandbox.paypal.com', PATH)
const getClientCredentials = () => {
  return Buffer.from(`${ENV.PAYPAL_CLIENT_ID}:${ENV.PAYPAL_CLIENT_SECRET}`).toString('base64')
}

export { getApiUrl, getClientCredentials }