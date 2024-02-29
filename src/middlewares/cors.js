import { DOMAINS } from 'utils/constants'
import APP_CONFIG from 'config/app.config'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'
import cor from 'cors'

const { NODE_ENV } = APP_CONFIG
const isProduction = NODE_ENV === 'production'

const corsOptions = {
  origin: function (origin, callback) {

    if (!isProduction) {
      return callback(null, true)
    }

    if (DOMAINS.includes(origin) && isProduction) {
      return callback(null, true)
    }

    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },

  optionsSuccessStatus: 200,

  credentials: true
}

module.exports = cor(corsOptions)