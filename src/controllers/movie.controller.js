/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { MovieServices } from 'services/movie.service'

const fetchAllController = async (req, res, next) => {
  try {
    const movies = await MovieServices.fetchAll()

    return res.status(StatusCodes.OK).json(movies)
  } catch (error) {
    next(error)
  }
}

const createMovieController = async (req, res, next) => {
  try {
    const movie = await MovieServices.createMovie(req.body)

    return res.status(StatusCodes.CREATED).json(movie)
  } catch (error) {
    next(error)
  }
}

const updateMovieController = async (req, res, next) => {
  try {
    const movie = await MovieServices.updateMovie(req.params.movieId, req.body)

    return res.status(StatusCodes.OK).json(movie)
  } catch (error) {
    next(error)
  }
}

const deleteMovieController = async (req, res, next) => {
  try {
    await MovieServices.deleteMovie(req.params.movieId)

    return res.status(StatusCodes.NO_CONTENT).json({ message: 'Delete movie successfully' })
  } catch (error) {
    next(error)
  }
}

export const MovieControllers = {
  fetchAllController,
  createMovieController,
  updateMovieController,
  deleteMovieController
}