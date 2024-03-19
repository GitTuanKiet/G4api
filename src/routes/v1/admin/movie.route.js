import express from 'express'

import { MovieControllers } from 'controllers/movie.controller'
import { MovieValidations } from 'validations/movie.validation'

const router = express.Router()

// views
router.get('/manager-movies', MovieControllers.getManagerMovies)
router.get('/create-movie', MovieControllers.addMovie)
router.get('/show-movie/:movieId', MovieControllers.showMovie)
router.get('/edit-movie/:movieId', MovieControllers.editMovie)

// api
router.post('/storage-movie', MovieValidations.createMovieValidation, MovieControllers.createMovieController)
router.post('/update-movie/:movieId', MovieValidations.updateMovieValidation, MovieControllers.updateMovieController)
router.post('/delete-movie/:movieId', MovieControllers.deleteMovieController)

module.exports = router
