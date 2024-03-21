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
    await MovieServices.createMovie(req.body)

    return res.status(StatusCodes.CREATED).json({ message: 'Movie created successfully' })
  } catch (error) {
    next(error)
  }
}

const updateMovieController = async (req, res, next) => {
  try {
    const { movieId } = req.params
    await MovieServices.updateMovie(movieId, req.body)

    return res.status(StatusCodes.OK).json({ message: 'Movie updated successfully' })
  } catch (error) {
    next(error)
  }
}

const deleteMovieController = async (req, res, next) => {
  try {
    const { movieId } = req.params
    await MovieServices.deleteMovie(movieId)

    return res.status(StatusCodes.OK).json({ message: 'Movie deleted successfully' })
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

