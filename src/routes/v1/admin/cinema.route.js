import express from 'express'

import { CinemaControllers } from 'controllers/cinema.controller'
import { CinemaValidations } from 'validations/cinema.validation'

const router = express.Router()

router.post('/create', CinemaValidations.createCinemaValidation, CinemaControllers.createCinemaController)

router.route('/:cinemaId')
  .put(CinemaValidations.updateCinemaValidation, CinemaControllers.updateCinemaController)

module.exports = router
