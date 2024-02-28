import express from 'express'

const router = express.Router()

router.use('/paypal', require('payments/paypal/routes'))

module.exports = router