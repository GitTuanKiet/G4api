import express from 'express'

const router = express.Router()

router.use('/auth', require('./auth.route'))

// verify token middleware
router.use(require('middlewares/verifyJWT'))

router.use('/upload', require('./upload.route'))
router.use('/user', require('./user.route'))
router.use('/card', require('./cards/card.route'))
router.use('/order', require('./order.route'))

module.exports = router