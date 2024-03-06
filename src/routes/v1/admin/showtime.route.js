import express from 'express'

import { ShowtimeControllers } from 'controllers/showtime.controller'
import { ShowtimeValidations } from 'validations/showtime.validation'

const router = express.Router()

router.route('/create')
  .post(ShowtimeValidations.createShowtimeValidation, ShowtimeControllers.createShowtimeController)

router.route('/:showtimeId')
  .put(ShowtimeValidations.updateShowtimeValidation, ShowtimeControllers.updateShowtimeController)
  .delete(ShowtimeControllers.deleteShowtimeController)

module.exports = router
