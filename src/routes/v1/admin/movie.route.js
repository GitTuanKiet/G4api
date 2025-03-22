import express from 'express'

import { MovieControllers } from 'controllers/movie.controller'
import { MovieValidations } from 'validations/movie.validation'

const router = express.Router()

router.route('/create')
  .post(MovieValidations.createMovieValidation, MovieControllers.createMovieController)

router.route('/:movieId')
  .put(MovieValidations.updateMovieValidation, MovieControllers.updateMovieController)
  .delete(MovieControllers.deleteMovieController)

module.exports = router
