import { StatusCodes } from 'http-status-codes'
import model from './model'
import { OrderModels } from 'models/order.model'
import { UserModels } from 'models/user.model'

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
    console.log('🚀 ~ createOrderController ~ data:', data)
    if (data.error) {
      return res.status(StatusCodes.BAD_REQUEST).json(data.error)
    }

    // Lưu đơn hàng vào database
    const order = await OrderModels.createOrder({
      userId : _id,
      payment: 'paypal',
      orderId: data.id,
      status: data.status,
      name: req.body.name,
      price: req.body.price,
      link: data.links?.find(link => link.rel === 'approve')?.href
    })

    // Lưu id đơn hàng vào user
    await UserModels.pushOrderIds(_id, order.insertedId)

    // Chuyển hướng đến trang thanh toán
    return res.redirect(data.links?.find(link => link.rel === 'approve')?.href)
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

    if (status === 'APPROVED') {
      // Xác nhận đơn hàng
      const data = await model.captureOrder(id, accessToken)
      if (data.error) {
        return res.status(StatusCodes.BAD_REQUEST).json(data.error)
      }

      // Cập nhật trạng thái đơn hàng trong database
      await OrderModels.updateOrderByOrderId(id, { status: data.status })

      // Gửi thông báo về client
      return res.status(StatusCodes.OK).json({ message: 'Payment success' })
    }

    // Gửi thông báo về client
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Payment failed' })
  } catch (error) {
    next(error)
  }
}

export default {
  createOrderController,
  checkOutController
}