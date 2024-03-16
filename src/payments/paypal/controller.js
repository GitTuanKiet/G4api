import { StatusCodes } from 'http-status-codes'
import model from './model'
import { OrderModels } from 'models/order.model'
import { CardServices } from 'services/card.service'
import { UserModels } from 'models/user.model'

import { sendMailOptions } from 'utils/mailer'


let accessTokenPaypal = ''

const createOrderController = async (req, res, next) => {
  try {
    const { _id } = req.user

    // Lấy access token
    if (!accessTokenPaypal) {
      accessTokenPaypal = await model.getAccessToken()
    }

    // Validate dữ liệu đầu vào
    const validated = await model.validate(req.body)
    if (validated.error) {
      return res.status(StatusCodes.BAD_REQUEST).json(validated.error)
    }

    // Tạo đơn hàng
    const orderData = model.paypalOrderData(validated)
    const data = await model.createOrder(orderData, accessTokenPaypal)
    if (data.error) {
      return res.status(StatusCodes.BAD_REQUEST).json(data.error)
    }

    const { id, status, links } = data

    if (status !== 'CREATED') {
      let message = 'Order not created'
      if (data.details) message = data.details[0].description
      return res.status(StatusCodes.BAD_REQUEST).json({ message })
    }

    if (!links) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No links' })
    }

    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No order id' })
    }

    const body = req.body
    const fixedPrice = body.price.toFixed(2)
    const name = body.name
    const description = body.description
    const order = body.order
    const currency = body.currency

    await Promise.all([
    // Lưu đơn hàng vào database
      OrderModels.createOrder({
        userId: _id,
        payment: 'paypal',
        orderId: data.id,
        status: data.status,
        name,
        description,
        currency,
        price: fixedPrice,
        order,
        links: data.links
      }),

      // Lưu thông tin thẻ vào model tương ứng
      CardServices.createCard(_id, req.body.order, { orderId: data.id, ...req.body, price: fixedPrice })
    ])

    console.log(`Payment: userId => ${_id}, ${order} => ${name}, price => ${fixedPrice} ${currency}`)
    // Trả về link thanh toán
    return res.status(StatusCodes.OK).json({ link: data.links[1].href })
  } catch (error) {
    next(error)
  }
}

const checkOutController = async (req, res, next) => {
  try {
    const { orderId } = req.params
    // Lấy access token
    if (!accessTokenPaypal) {
      accessTokenPaypal = await model.getAccessToken()
    }

    // Lấy thông tin đơn hàng
    const order = await model.getOrder(orderId, accessTokenPaypal)
    const { id, status } = order

    if (status === 'COMPLETED') {
      return res.status(StatusCodes.OK).json({ message: 'Payment completed' })
    }

    if (status === 'APPROVED') {
      // Lấy thông tin đơn hàng trong database
      const order = await OrderModels.findOneByOrderId(id)

      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not found' })
      }

      // Xác nhận đơn hàng
      const data = await model.captureOrder(id, accessTokenPaypal)
      if (data.error) {
        return res.status(StatusCodes.BAD_REQUEST).json(data.error)
      }

      // Cập nhật trạng thái trong database
      await Promise.all([
        CardServices.updateStatusActive(id, { status: 'active', expiredAt: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000) }),
        OrderModels.updateOrderByOrderId(id, { status: data.status }),
        UserModels.updateUser(req.user._id, { POINTS: Number(req.user.POINTS) + Number(order.price) })
      ])

      // Gửi thông báo về client
      return res.status(StatusCodes.OK).json({ message: 'Payment success' })
    }

    // Gửi thông báo về client
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Payment failed' })
  } catch (error) {
    next(error)
  }
}

const cancelController = async (req, res, next) => {
  try {
    const { orderId } = req.params
    // Lấy access token
    if (!accessTokenPaypal) {
      accessTokenPaypal = await model.getAccessToken()
    }

    // Lấy thông tin đơn hàng
    const order = await model.getOrder(orderId, accessTokenPaypal)
    const { id, status } = order

    if (status === 'CREATED') {
      // Lấy thông tin đơn hàng trong database
      const data = await OrderModels.findOneByOrderId(id)

      if (!data) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not found' })
      }

      // Gửi links về email người dùng
      sendMailOptions(req.user, data, 'paypalPayment')
      return res.status(StatusCodes.OK).json({ message: 'Check your email to pay again' })
    }

    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not created' })
  } catch (error) {
    next(error)
  }
}

export default {
  createOrderController,
  checkOutController,
  cancelController
}