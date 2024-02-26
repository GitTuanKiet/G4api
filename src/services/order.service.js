/* eslint-disable no-useless-catch */
import { OrderModels } from 'models/order.model'
import { PaypalApis } from 'api/paypal.api'

const InvalidFields = ['_id', 'application_context']

const createOrder = async (userId, data) => {
  try {
    const access_token = await PaypalApis.getAccessToken()
    const result = await PaypalApis.createOrder(userId, access_token, data)
    await OrderModels.createOrder(result)
    return result.links.find(link => link.rel === 'approve')
  } catch (error) {
    throw error
  }
}

export const OrderServices = {
  createOrder
}