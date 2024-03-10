import { DOMAINS, isProduction } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'
import cor from 'cors'

const isProd = isProduction()

const corsOptions = {
  origin: function (origin, callback) {

    if (!isProd) {
      return callback(null, true)
    }

    if (DOMAINS.includes(origin) && isProd) {
      return callback(null, true)
    }

    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },

  optionsSuccessStatus: 200,

  credentials: true
}

module.exports = cor(corsOptions)