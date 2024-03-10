import Joi from 'joi'
import { getApiUrl, getClientCredentials } from 'utils/constants'
import { VNDtoUSD } from 'utils/formatters'
import ApiError from 'utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// getAccessToken - hàm này dùng để lấy access token
const getAccessToken = async () => {
  try {
    const apiUrl = getApiUrl('/v1/oauth2/token')
    const clientCredentials = getClientCredentials()

    return await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${clientCredentials}`
      },
      body: 'grant_type=client_credentials'
    }).then((res) => res.json())
      .then((data) => {
        return data.access_token
      }).catch((error) => {
        throw error
      })
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get access token: ' + error.message)
  }
}

// validate - hàm này dùng để kiểm tra dữ liệu đầu vào
const validate = async (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().required().precision(2),
    currency: Joi.string().trim().required(),
    return_url: Joi.string().trim().required()
  })

  return await schema.validateAsync(data, { allowUnknown: true })
}

// paypalOrderData - hàm này dùng để tạo dữ liệu đơn hàng cho paypal
const paypalOrderData = ({ name, price, return_url, currency, ...other }) => {
  // const priceUSD = VNDtoUSD(price)
  if (other?.description) other.description = JSON.stringify(other.description)
  else other.description = JSON.stringify(other)
  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        items: [
          {
            name,
            description: JSON.stringify(other.description),
            unit_amount: {
              currency_code: currency,
              value: price
            },
            quantity: '1'
          }
        ],
        amount: {
          currency_code: currency,
          value: price,
          breakdown: {
            item_total: {
              currency_code: currency,
              value: price
            }
          }
        }
      }
    ],
    application_context: {
      return_url,
      cancel_url: return_url
    }
  }
}

// createOrder - hàm này dùng để tạo đơn hàng
const createOrder = async (data, accessToken) => {
  try {
    const apiUrl = getApiUrl('/v2/checkout/orders')

    return await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    }).then((res) => res.json())
      .then((data) => {
        return data
      }).catch((error) => {
        throw error
      })
  } catch (error) {
    throw new ApiError(StatusCodes.PRECONDITION_FAILED, 'Failed to create order: ' + error.message)
  }
}

// getOrder - hàm này dùng để lấy thông tin đơn hàng
const getOrder = async (orderId, accessToken) => {
  try {
    const apiUrl = getApiUrl(`/v2/checkout/orders/${orderId}`)

    return await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }).then((res) => res.json())
      .then((data) => {
        return data
      }).catch((error) => {
        throw error
      })
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get order: ' + error.message)
  }
}

// captureOrder - hàm này dùng để xác nhận đơn hàng
const captureOrder = async (orderId, accessToken) => {
  try {
    const apiUrl = getApiUrl(`/v2/checkout/orders/${orderId}/capture`)

    return await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }).then((res) => res.json())
      .then((data) => {
        return data
      }).catch((error) => {
        throw error
      })
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to capture order: ' + error.message)
  }
}

export default { validate, paypalOrderData, getAccessToken, createOrder, getOrder, captureOrder }