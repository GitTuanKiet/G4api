import express from 'express'

import { TheaterControllers } from 'controllers/theater.controller'
import { TheaterValidations } from 'validations/theater.validation'

const router = express.Router()

router.post('/create', TheaterValidations.createTheaterValidation, TheaterControllers.createTheaterController)

router.route('/:theaterId')
  .put(TheaterValidations.updateTheaterValidation, TheaterControllers.updateTheaterController)

module.exports = router
