import express from 'express'

import { ReportControllers } from 'controllers/report.controller'
import { MovieValidations } from 'validations/movie.validation'
const router = express.Router()

router.get('/financialReport', ReportControllers.financialReport)
router.get('/ordersReport', ReportControllers.ordersReport)

import { MovieControllers } from 'controllers/movie.controller'

router.get('/manager-movies', MovieControllers.getManagerMovies)
router.get('/create-movie', MovieControllers.addMovie)
router.post('/storage-movie',MovieValidations.createMovieValidation,MovieControllers.createMovieController)
router.get('/show-movie/:movieId', MovieControllers.showMovie)
router.get('/edit-movie/:movieId', MovieControllers.editMovie)
router.post('/update-movie/:movieId',MovieValidations.updateMovieValidation, MovieControllers.updateMovieController)
router.post('/delete-movie/:movieId', MovieControllers.deleteMovieController)

import { ShowtimeControllers } from 'controllers/showtime.controller'
import { ShowtimeValidations } from 'validations/showtime.validation'

router.get('/manager-showtime', ShowtimeControllers.getManagerShowtime)
router.get('/create-showtime', ShowtimeControllers.addShowtime)
router.post('/storage-showtime',ShowtimeValidations.createShowtimeValidation, ShowtimeControllers.createShowtimeController)
router.get('/edit-showtime/:showtimeId',ShowtimeControllers.editShowtime)
router.post('/update-showtime/:showtimeId',ShowtimeValidations.updateShowtimeValidation, ShowtimeControllers.updateShowtimeController)
router.post('/delete-showtime/:showtimeId', ShowtimeControllers.deleteShowtimeController)

module.exports = router