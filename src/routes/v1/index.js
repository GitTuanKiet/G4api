import express from 'express'

const router = express.Router()

router.use('/auth', require('./auth.route'))

// verify token middleware
router.use(require('middlewares/verifyJWT'))

router.use('/upload', require('./upload.route'))
router.use('/user', require('./client/user.route'))
router.use('/card', require('./client/cards/card.route'))
// router.use('/order', require('./order.route'))
router.use('/payment', require('./client/payment.route'))

module.exports = router