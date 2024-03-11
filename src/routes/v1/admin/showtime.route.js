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
router.post('/storate-showtime', ShowtimeControllers.storageShowtime)
router.get('/edit-showtime/:id', ShowtimeControllers.editShowtime)
router.post('/update-showtime/:id', ShowtimeControllers.updateShowtime)
router.post('/delete-showtime/:id', ShowtimeControllers.destroyShowtime)

module.exports = router

