import PAYMENT_CONFIG from 'config/payment.config'
import APP_CONFIG from 'config/app.config'
import path from 'path'


const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = PAYMENT_CONFIG

export const DOMAINS = [
  'http://localhost:5173',
  APP_CONFIG.DOMAIN
]

const getDOMAIN = () => {
  let DOMAIN = 'http://localhost:5173'
  if (isProduction()) {
    DOMAIN = APP_CONFIG.DOMAIN
  }

  return DOMAIN
}

const isProduction = () => APP_CONFIG.NODE_ENV === 'production'

// regex cho objectId mongo
export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_MESSAGE = { 'string.pattern.base': 'Invalid ObjectId' }
export const UPLOAD_REGEX = /^(\/|\\)?uploads(\/|\\)?[^\s]+\.(jpg|jpeg|png|gif|svg)$/

// paypal
const getApiUrl = (PATH) => path.join('https://api-m.sandbox.paypal.com', PATH)
const getClientCredentials = () => {
  return Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
}
export const getActionAd= (PATH) => path.join('/v1/admin/', PATH)

export { getDOMAIN, isProduction, getApiUrl, getClientCredentials }