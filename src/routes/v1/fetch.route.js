import express from 'express'

import { MovieControllers } from 'controllers/movie.controller'
import { CinemaControllers } from 'controllers/cinema.controller'
import { TheaterControllers } from 'controllers/theater.controller'
import { ShowtimeControllers } from 'controllers/showtime.controller'

const router = express.Router()

router.route('/movies').get(MovieControllers.fetchAllController)
router.route('/cinemas').get(CinemaControllers.fetchAllController)
router.route('/theaters').get(TheaterControllers.fetchAllController)
router.route('/showtimes').get(ShowtimeControllers.fetchAllController)

module.exports = router