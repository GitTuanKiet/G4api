import express from 'express'

import { OrderControllers } from 'controllers/order.controller'

const router = express.Router()

router.get('report', OrderControllers.ordersReport)

module.exports = router