import { StatusCodes } from 'http-status-codes'
import model from './model'
import { OrderModels } from 'models/order.model'
import { CardServices } from 'services/card.service'

import MAIL_CONFIG from 'config/mail.config'
import { sendMail } from 'utils/mailer'

const { MAIL_USER } = MAIL_CONFIG

let accessToken = ''

const createOrderController = async (req, res, next) => {
  try {
    const { _id } = req.user

    // Lấy access token
    if (!accessToken) {
      accessToken = await model.getAccessToken()
    }

    // Validate dữ liệu đầu vào
    const validated = await model.validate(req.body)
    if (validated.error) {
      return res.status(StatusCodes.BAD_REQUEST).json(validated.error)
    }

    // Tạo đơn hàng
    const orderData = model.paypalOrderData(validated)
    const data = await model.createOrder(orderData, accessToken)
    if (data.error) {
      return res.status(StatusCodes.BAD_REQUEST).json(data.error)
    }

    await Promise.all([
    // Lưu đơn hàng vào database
      OrderModels.createOrder({
        userId: _id,
        payment: 'paypal',
        orderId: data.id,
        status: data.status,
        name: req.body.name,
        price: req.body.price,
        type: req.body.type,
        links: data.links
      }),

      // Lưu thông tin thẻ vào model tương ứng
      CardServices.createCard(_id, req.body.type, { orderId: data.id, ...req.body })
    ])

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
    if (!accessToken) {
      accessToken = await model.getAccessToken()
    }

    // Lấy thông tin đơn hàng
    const order = await model.getOrder(orderId, accessToken)
    const { id, status } = order

    if (status === 'COMPLETED') {
      return res.status(StatusCodes.OK).json({ message: 'Payment completed' })
    }

    if (status === 'APPROVED') {
      // Xác nhận đơn hàng
      const data = await model.captureOrder(id, accessToken)
      if (data.error) {
        return res.status(StatusCodes.BAD_REQUEST).json(data.error)
      }

      // Cập nhật trạng thái đơn hàng trong database
      await Promise.all([
        CardServices.updateStatusByOrderId(id, { status: 'active', expiredAt: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000) }),
        OrderModels.updateOrderByOrderId(id, { status: data.status })
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
    if (!accessToken) {
      accessToken = await model.getAccessToken()
    }

    // Lấy thông tin đơn hàng
    const order = await model.getOrder(orderId, accessToken)
    const { id, status } = order

    if (status === 'CREATED') {
      // Lấy thông tin đơn hàng trong database
      const data = await OrderModels.findOneByOrderId(id)

      if (!data) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not found' })
      }

      // Gửi links về email người dùng
      const mailOptions = {
        from: MAIL_USER,
        to: req.user.email,
        subject: 'Paypal payment',
        html: `<p>Click <a href="${data.links[1].href}">here</a> to pay again</p>`
      }

      // Gửi email
      sendMail(mailOptions)
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