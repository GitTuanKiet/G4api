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
router.use('/fetch', require('./fetch.route'))
router.use('/auth', require('./auth.route'))

// verify token middleware
router.use(require('middlewares/verifyJWT'))

// client routes
router.use('/user', require('./client/user.route'))
router.use('/payment', require('./client/payment.route'))

// check role middleware
router.use(require('middlewares/checkRole'))

// admin routes
router.use('/admin/movie', require('./admin/movie.route'))
router.use('/admin/cinema', require('./admin/cinema.route'))

module.exports = router