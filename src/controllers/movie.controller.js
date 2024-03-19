/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { MovieServices } from 'services/movie.service'
import { getActionAd } from 'utils/constants'
import { fixString } from 'utils/formatters'

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

    return res.redirect(getActionAd('movie/manager-movies'))
  } catch (error) {
    next(error)
  }
}

const updateMovieController = async (req, res, next) => {
  try {
    const { movieId } = req.params
    await MovieServices.updateMovie(movieId, req.body)

    return res.redirect(getActionAd('movie/manager-movies'))
  } catch (error) {
    next(error)
  }
}

const deleteMovieController = async (req, res, next) => {
  try {
    const { movieId } = req.params
    await MovieServices.deleteMovie(movieId)

    return res.redirect(getActionAd('movie/manager-movies'))
  } catch (error) {
    next(error)
  }
}


const getManagerMovies = async (req, res, next) => {
  try {
    const movies = await MovieServices.fetchAll()

    return res.render('manager-movies.ejs', { movies, getActionAd })
  } catch (error) {
    next(error)
  }
}

//show
const showMovie = async (req, res, next) =>
{
  try {
    const { movieId } = req.params
    const movies = await MovieServices.fetchAll()
    const movie = movies.find((movie) => fixString(movie._id) === movieId)

    return res.render('show-movie.ejs', { movie })
  } catch (error) {
    next(error)
  }

}

//create
const addMovie = (req, res) => {
  return res.render('add-movie.ejs', { getActionAd })
}

//edit
const editMovie = async (req, res, next) =>
{
  try {
    const { movieId } = req.params
    const movies = await MovieServices.fetchAll()
    const movie = movies.find((movie) => fixString(movie._id) === movieId)

    return res.render('edit-movie.ejs', { movie, getActionAd })
  } catch (error) {
    next(error)
  }
}

export const MovieControllers = {
  fetchAllController,
  createMovieController,
  updateMovieController,
  deleteMovieController,
  getManagerMovies,
  addMovie,
  editMovie,
  showMovie
}

