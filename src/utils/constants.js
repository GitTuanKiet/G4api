import PAYMENT_CONFIG from 'config/payment.config'
import path from 'path'

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = PAYMENT_CONFIG

export const DOMAINS = [
  'http://localhost:5173',
  '...'
]

// regex cho objectId mongo
export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_MESSAGE = { 'string.pattern.base': 'Invalid ObjectId' }
export const UPLOAD_REGEX = /^(\/|\\)?uploads(\/|\\)?[^\s]+\.(jpg|jpeg|png|gif|svg)$/
// paypal
const getApiUrl = (PATH) => path.join('https://api-m.sandbox.paypal.com', PATH)
const getClientCredentials = () => {
  return Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
}

export { getApiUrl, getClientCredentials }