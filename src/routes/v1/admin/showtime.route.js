import express from 'express'

import { ShowtimeControllers } from 'controllers/showtime.controller'
import { ShowtimeValidations } from 'validations/showtime.validation'

const router = express.Router()

router.route('/create')
  .post(ShowtimeValidations.createShowtimeValidation, ShowtimeControllers.createShowtimeController)

router.route('/:showtimeId')
  .put(ShowtimeValidations.updateShowtimeValidation, ShowtimeControllers.updateShowtimeController)
  .delete(ShowtimeControllers.deleteShowtimeController)

router.get('/manager-showtime', ShowtimeControllers.getManagerShowtime)
router.get('/create-showtime', ShowtimeControllers.addShowtime)
router.post('/storage-showtime', ShowtimeControllers.createShowtimeController)
router.get('/edit-showtime/:showtimeId', ShowtimeControllers.editShowtime)
router.post('/update-showtime/:showtimeId', ShowtimeControllers.updateShowtimeController)
router.post('/delete-showtime/:showtimeId', ShowtimeControllers.deleteShowtimeController)

module.exports = router

