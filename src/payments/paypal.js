/* eslint-disable no-useless-catch */
import { getApiUrl, getClientCredentials } from 'utils/constants'

/**
 * @typedef {Object} OrderData - thông tin đơn hàng
 * @property {string} intent - kiểu đơn hàng
 * @property {object} purchase_units - thông tin mua hàng
 * @property {object} purchase_units[].items - danh sách sản phẩm
 * @property {string} purchase_units[].items.name - tên sản phẩm
 * @property {string} purchase_units[].items.description - mô tả sản phẩm
 * @property {string} purchase_units[].items.sku - mã sản phẩm
 * @property {string} purchase_units[].items.unit_amount - giá sản phẩm
 * @property {string} purchase_units[].items.unit_amount.currency_code - loại tiền
 * @property {string} purchase_units[].items.unit_amount.value - giá trị
 * @property {string} purchase_units[].items.quantity - số lượng sản phẩm
 * @property {string} purchase_units[].amount - tổng tiền
 * @property {string} purchase_units[].amount.currency_code - loại tiền
 * @property {string} purchase_units[].amount.value - giá trị
 * @property {string} purchase_units[].amount.breakdown - thông tin chi tiết
 * @property {string} purchase_units[].amount.breakdown.item_total - tổng tiền sản phẩm
 * @property {string} purchase_units[].amount.breakdown.item_total.currency_code - loại tiền
 * @property {string} purchase_units[].amount.breakdown.item_total.value - giá trị
 * @property {string} purchase_units[].amount.breakdown.shipping - phí vận chuyển - nếu có
 * @property {string} purchase_units[].amount.breakdown.handling - phí xử lý - nếu có
 * @property {string} purchase_units[].amount.breakdown.tax_total - thuế - nếu có
 * @property {string} purchase_units[].amount.breakdown.shipping_discount - giảm giá vận chuyển - nếu có
 * @property {string} purchase_units[].amount.breakdown.discount - giảm giá - nếu có
 * @property {object} application_context - url chuyển hướng
 * @property {string} application_context.return_url - url chuyển hướng khi thanh toán thành công
 * @property {string} application_context.cancel_url - url chuyển hướng khi hủy thanh toán
 */


/**
 * exampleOrderData - ví dụ về thông tin đơn hàng
 * @type {OrderData}
 * @example
 * {
 *  intent: 'CAPTURE',
 *  purchase_units: [
 *   {
 *   items: [
 *   {
 *    name: 'T-Shirt',
 *    description: 'Green XL',
 *    sku: 'sku01',
 *    unit_amount:
 *      {
 *      currency_code: 'USD',
 *      value: '90.00'
 *      },
 *    quantity: '1'
 *    }
 *  ],
 *  amount:
 *   {
 *    currency_code: 'USD',
 *    value: '90.00',
 *    breakdown:
 *      {
 *      item_total:
 *        {
 *        currency_code: 'USD',
 *        value: '90.00'
 *        }
 *     }
 *    }
 *  }
 * ],
 * application_context:
 *  {
 *  return_url: 'https://example.com/return',
 *  cancel_url: 'https://example.com/cancel'
 *  }
 * }
 */


/**
 * getAccessToken - hàm này dùng để lấy access token
 * @returns {Promise<string>} access token - token để xác thực
 * @throws lỗi nếu có
 */
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
    throw error
  }
}

/**
 * createOrder - hàm này dùng để tạo đơn hàng
 * @param {string} userId
 * @param {string} accessToken
 * @param {OrderData} orderData
 * @returns {Promise<object>} đơn hàng đã được tạo
 * @throws {Error} lỗi nếu có
 */
const createOrder = async (userId, accessToken, orderData) => {
  try {
    const apiUrl = getApiUrl('/v2/checkout/orders')
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PayPal-Request-Id': userId,
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      throw new Error(`Error creating order: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}
/**
 * captureOrder - hàm này dùng để xác nhận đơn hàng
 * @param {string} accessToken
 * @param {string} orderId
 * @returns {Promise<object>} đơn hàng đã được xác nhận
 * @throws {Error} lỗi nếu có
 */
const captureOrder = async (accessToken, orderId) => {
  try {
    const apiUrl = getApiUrl(`/v2/checkout/orders/${orderId}/capture`)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error capturing order: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

/**
 * refundOrder - hàm này dùng để hoàn trả đơn hàng
 * @param {string} accessToken
 * @param {string} orderId
 * @returns {Promise<object>} đơn hàng đã được hoàn trả
 * @throws {Error} lỗi nếu có
 */
const refundOrder = async (accessToken, orderId) => {
  try {
    const apiUrl = getApiUrl(`/v2/payments/captures/${orderId}/refund`)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error refunding order: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

/**
 * voidOrder - hàm này dùng để hủy đơn hàng
 * @param {string} accessToken
 * @param {string} orderId
 * @returns {Promise<object>} đơn hàng đã được hủy
 * @throws {Error} lỗi nếu có
 */
const voidOrder = async (accessToken, orderId) => {
  try {
    const apiUrl = getApiUrl(`/v2/checkout/orders/${orderId}/void`)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error voiding order: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

export const Paypal = { getAccessToken, createOrder, captureOrder, refundOrder, voidOrder }
