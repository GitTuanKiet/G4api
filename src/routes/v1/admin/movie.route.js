import express from 'express'

import { MovieControllers } from 'controllers/movie.controller'
import { MovieValidations } from 'validations/movie.validation'

const router = express.Router()

router.route('/create')
  .post(MovieValidations.createMovieValidation, MovieControllers.createMovieController)

router.route('/:movieId')
  .put(MovieValidations.updateMovieValidation, MovieControllers.updateMovieController)
  .delete(MovieControllers.deleteMovieController)

router.get('/manager-movies', MovieControllers.getManagerMovies)
router.get('/create-movie', MovieControllers.addMovie)
router.post('/storate-movie', MovieControllers.createMovieController)
router.get('/show-movie/:id', MovieControllers.showMovie)
router.get('/edit-movie/:id', MovieControllers.editMovie)
router.post('/update-movie/:id', MovieControllers.updateMovieController)
router.post('/delete-movie/:id', MovieControllers.deleteMovieController)

module.exports = router

