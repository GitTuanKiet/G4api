import express from 'express'

const router = express.Router()

// public routes
router.get('/uploads/:file', (req, res) => {
  try {
    res.sendFile(req.params.file, { root: 'uploads' })
  } catch (err) {
    res.status(404).send('File not found')
  }
})

router.use('/auth', require('./auth.route'))

// verify token middleware
router.use(require('middlewares/verifyJWT'))

// routes
router.use('/uploads', require('./upload.route'))
router.use('/user', require('./client/user.route'))
router.use('/card', require('./client/card.route'))
router.use('/payment', require('./client/payment.route'))

module.exports = router