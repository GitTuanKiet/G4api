import express from 'express'

import { ShowtimeControllers } from 'controllers/showtime.controller'
import { ShowtimeValidations } from 'validations/showtime.validation'

const router = express.Router()

// views
router.get('/manager-showtimes', ShowtimeControllers.getManagerShowtime)
router.get('/create-showtime', ShowtimeControllers.addShowtime)
router.get('/edit-showtime/:showtimeId', ShowtimeControllers.editShowtime)

// api
router.post('/storage-showtime', ShowtimeValidations.createShowtimeValidation, ShowtimeControllers.createShowtimeController)
router.post('/update-showtime/:showtimeId', ShowtimeValidations.updateShowtimeValidation, ShowtimeControllers.updateShowtimeController)
router.post('/delete-showtime/:showtimeId', ShowtimeControllers.deleteShowtimeController)

module.exports = router

