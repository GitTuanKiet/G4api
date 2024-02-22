import express from 'express'

import { VoucherControllers } from 'controllers/cards/voucher.controller'
import { GiftCardValidations } from 'validations/cards/voucher.validation'

const router = express.Router()

router.route('/register')
  .post(GiftCardValidations.registerVoucher, VoucherControllers.registerVoucher)


module.exports = router