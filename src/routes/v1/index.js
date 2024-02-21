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
router.use('/user', require('./user.route'))

module.exports = router