import express from 'express'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'Hello world!'
  })
})

router.use('/example', require('./exampleRoute'))
router.use('/auth', require('./auth.route'))

// verify token middleware
router.use(require('middlewares/verifyJWT'))

router.use('/upload', require('./upload.route'))
router.use('/user', require('./user.route'))
router.use('/card', require('./cards/card.route'))
router.use('/order', require('./order.route'))

module.exports = router