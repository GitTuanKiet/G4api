import { ENV } from 'config/environment'


export const DOMAINS = [
  'http://localhost:5173',
  '...'
]

// regex cho objectId mongo
export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_MESSAGE = { 'string.pattern.base': 'Invalid ObjectId' }

// paypal api
export const PAYPAL_API = 'https://api-m.sandbox.paypal.com'
export const PAYPAL_AUTH = Buffer.from(`${ENV.PAYPAL_CLIENT_ID}:${ENV.PAYPAL_CLIENT_SECRET}`).toString('base64')