import express from 'express'

import { GiftCardControllers } from 'controllers/cards/gift.controller'
import { GiftCardValidations } from 'validations/cards/gift.validation'

const router = express.Router()

router.route('/register')
  .post(GiftCardValidations.registerGiftCard, GiftCardControllers.registerGiftCard)


module.exports = router