import express from 'express'

import { ReportControllers } from 'controllers/report.controller'

const router = express.Router()

router.get('/financialReport', ReportControllers.financialReport)
router.get('/ordersReport', ReportControllers.ordersReport)

import { MovieControllers } from 'controllers/movie.controller'

router.get('/manager-movies', MovieControllers.getManagerMovies)
router.get('/create-movie', MovieControllers.addMovie)
router.route('/storate-movie').post(MovieControllers.createMovieController)
router.get('/show-movie/:movieId', MovieControllers.showMovie)
router.get('/edit-movie/:movieId', MovieControllers.editMovie)
router.post('/update-movie/:movieId', MovieControllers.updateMovieController)
router.post('/delete-movie/:movieId', MovieControllers.deleteMovieController)

import { ShowtimeControllers } from 'controllers/showtime.controller'

router.get('/manager-showtime', ShowtimeControllers.getManagerShowtime)
router.get('/create-showtime', ShowtimeControllers.addShowtime)
router.post('/storate-showtime', ShowtimeControllers.createShowtimeController)
router.get('/edit-showtime/:showtimeId', ShowtimeControllers.editShowtime)
router.post('/update-showtime/:showtimeId', ShowtimeControllers.updateShowtimeController)
router.post('/delete-showtime/:showtimeId', ShowtimeControllers.deleteShowtimeController)

module.exports = router