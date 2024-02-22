import express from 'express'

import { CouponControllers } from 'controllers/cards/coupon.controller'
import { CouponValidations } from 'validations/cards/coupon.validation'

const router = express.Router()

router.route('/register')
  .post(CouponValidations.registerCoupon, CouponControllers.registerCoupon)

router.route('/fetch-all')
  .get(CouponControllers.fetchAllByUserId)

module.exports = router
