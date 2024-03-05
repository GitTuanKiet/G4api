import express from 'express'

import { CardControllers } from 'controllers/card.controller'

const router = express.Router()

router.route('/fetch-all')
  .get(CardControllers.fetchAllByUserId)


module.exports = router