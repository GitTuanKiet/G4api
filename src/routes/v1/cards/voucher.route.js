import express from 'express'

import { VoucherControllers } from 'controllers/cards/voucher.controller'
import { VoucherValidations } from 'validations/cards/voucher.validation'

const router = express.Router()

router.route('/register')
  .post(VoucherValidations.registerVoucher, VoucherControllers.registerVoucher)

router.route('/fetch-all')
  .get(VoucherControllers.fetchAllByUserId)

module.exports = router