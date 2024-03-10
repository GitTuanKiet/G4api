import express from 'express'

const router = express.Router()

router.use(require('middlewares/checkRole'))

router.use('/showtime', require('./showtime.route'))
router.use('/movie', require('./movie.route'))
router.use('/cinema', require('./cinema.route'))

module.exports = router