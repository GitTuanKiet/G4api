import express from 'express'
import controller from './controller'
const router = express.Router()

router.route('/create')
  .post(controller.createOrderController)

router.route('/check-out/:orderId')
  .get(controller.checkOutController)

module.exports = router
