import express from 'express'
import controller from './controller'
const router = express.Router()

router.route('/create')
  .post(controller.createOrderController)

router.route('/check/:orderId')
  .get(controller.checkOutController)

router.route('/cancel/:orderId')
  .get(controller.cancelController)

module.exports = router
