import PAYMENT_CONFIG from 'config/payment.config'
import APP_CONFIG from 'config/app.config'
import path from 'path'

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = PAYMENT_CONFIG

// regex cho objectId mongo
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/
const OBJECT_ID_MESSAGE = { 'string.pattern.base': 'Invalid ObjectId' }
const UPLOAD_REGEX = /^(\/|\\)?uploads(\/|\\)?[^\s]+\.(jpg|jpeg|png|gif|svg)$/

export { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE, UPLOAD_REGEX }

const DOMAINS = [
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

// paypal
const getApiUrl = (PATH) => path.join('https://api-m.sandbox.paypal.com', PATH)
const getClientCredentials = () => Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')


export { DOMAINS, getDOMAIN, isProduction, getApiUrl, getClientCredentials }