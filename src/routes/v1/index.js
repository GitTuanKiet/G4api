import express from 'express'

const router = express.Router()

// public routes
router.use('/fetch', require('./fetch.route'))
router.use('/auth', require('./auth.route'))

// admin routes
router.use('/admin', require('./admin'))

// verify token middleware
router.use(require('middlewares/verifyJWT'))

// client routes
router.use('/user', require('./client/user.route'))
router.use('/payment', require('./client/payment.route'))

module.exports = router