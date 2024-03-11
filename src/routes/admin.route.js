import express from 'express'

import { ReportControllers } from 'controllers/report.controller'

const router = express.Router()

router.get('/financialReport', ReportControllers.financialReport)
router.get('/ordersReport', ReportControllers.ordersReport)

import { MovieControllers } from 'controllers/movie.controller'

router.get('/manager-movies', MovieControllers.getManagerMovies)
router.get('/create-movie', MovieControllers.addMovie)
router.post('/storate-movie', MovieControllers.storageMovie)
router.get('/show-movie/:id', MovieControllers.showMovie)
router.get('/edit-movie/:id', MovieControllers.editMovie)
router.post('/update-movie/:id', MovieControllers.updateMovie)
router.post('/delete-movie/:id', MovieControllers.destroyMovie)

import { ShowtimeControllers } from 'controllers/showtime.controller'

router.get('/manager-showtime', ShowtimeControllers.getManagerShowtime)
router.get('/create-showtime', ShowtimeControllers.addShowtime)
router.post('/storate-showtime', ShowtimeControllers.storageShowtime)
router.get('/edit-showtime/:id', ShowtimeControllers.editShowtime)
router.post('/update-showtime/:id', ShowtimeControllers.updateShowtime)
router.post('/delete-showtime/:id', ShowtimeControllers.destroyShowtime)

module.exports = router