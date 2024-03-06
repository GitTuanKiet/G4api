import express from 'express'

import { MovieControllers } from 'controllers/movie.controller'
import { CinemaControllers } from 'controllers/cinema.controller'
import { ShowtimeControllers } from 'controllers/showtime.controller'

const router = express.Router()

router.route('/movies').get(MovieControllers.fetchAllController)
router.route('/cinemas').get(CinemaControllers.fetchAllController)
router.route('/showtimes').get(ShowtimeControllers.fetchAllController)

module.exports = router