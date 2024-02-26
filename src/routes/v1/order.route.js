import express from 'express'

import { OrderControllers } from 'controllers/order.controller'
import { OrderValidations } from 'validations/order.validation'

const router = express.Router()

router.route('/create')
  .post(OrderValidations.createOrderValidation, OrderControllers.createOrderController)

router.route('/capture/:id')
  .post(OrderControllers.captureOrderController)

router.route('/refund/:id')
  .post(OrderControllers.refundOrderController)

router.route('/void/:id')
  .post(OrderControllers.voidOrderController)

module.exports = router
