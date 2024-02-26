import { StatusCodes } from 'http-status-codes'
import { OrderServices } from 'services/order.service'

const createOrderController = async (req, res, next) => {
  try {
    const { userId } = req.user
    const url = await OrderServices.createOrder(userId, req.body)

    url ? res.redirect(url.href) : res.status(StatusCodes.BAD_REQUEST).json({ message: 'Failed to create order' })
  } catch (error) {
    next(error)
  }
}

const captureOrderController = async (req, res, next) => {
  try {
    const result = await OrderServices.captureOrder(req.params.orderId)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const refundOrderController = async (req, res, next) => {
  try {
    const result = await OrderServices.refundOrder(req.params.orderId)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const voidOrderController = async (req, res, next) => {
  try {
    const result = await OrderServices.voidOrder(req.params.orderId)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const OrderControllers = {
  createOrderController,
  captureOrderController,
  refundOrderController,
  voidOrderController
}