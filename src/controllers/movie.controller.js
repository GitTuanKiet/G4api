/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { MovieServices } from 'services/movie.service'

import { ShowtimeModels } from 'models/showtime.model'
import { MovieModels } from 'models/movie.model'

import { slugify } from 'utils/formatters'

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


const getManagerMovies = async (req, res, next) => {
  const movies = await MovieModels.list()
  res.render('manager-movies.ejs', { movies } )
}

//show
const showMovie = async (req, res, next) =>
{
  const movieId =req.params.id
  const movie = await MovieModels.findOneById(movieId)
  return res.render('show-movie.ejs', { movie })
}

//create
const addMovie = (req, res) => {
  return res.render('add-movie.ejs')
}

const storageMovie = async(req, res, next) => {
  // xử lý lưu những thành phần vừa tạo

  try {
    const formData = req.body
    formData.actors = formData.actors.split(',').map(actor => actor.trim())
    formData.directors = formData.directors.split(',').map(actor => actor.trim())
    formData.trailer = formData.trailer.replace('youtu.be', 'www.youtube.com/embed')
    formData.slug = slugify(formData.title)
    await MovieModels.createMovie(formData)
    res.redirect('/manager-movies')
  } catch (error) {
    next(error)
  }
}


//edit
const editMovie = async (req, res, next) =>
{
  const movieId =req.params.id
  const movie = await MovieModels.findOneById(movieId)

  return res.render('edit-movie.ejs', { movie })
}

const updateMovie = async(req, res, next) =>
{
  try {
    const movieID = req.params.id
    const formData = req.body
    formData.actors = formData.actors.split(',').map(actor => actor.trim().replace(/^,|,$/g, ''))
    formData.directors = formData.directors.split(',').map(director => director.trim().replace(/^,|,$/g, ''))
    formData.trailer = formData.trailer.replace('youtu.be', 'www.youtube.com/embed')
    if (formData.title) formData.slug = slugify(formData.title)
    await MovieModels.updateMovie(movieID, formData)
    res.redirect('/manager-movies')
  } catch (error) {
    next(error)
  }
}

//delete
const destroyMovie = async (req, res, next) => {
  try {
    const movieID = req.params.id
    await ShowtimeModels.deleteShowtimeByMovieId(movieID) // Xoá các showtime liên quan đến phim
    await MovieModels.deleteMovie(movieID) // Xoá phim

    res.redirect('/manager-movies') // Chuyển hướng người dùng đến trang quản lý phim
  } catch (error) {
    next(error) // Truyền lỗi tới middleware xử lý lỗi tiếp theo
  }
}

export const MovieControllers = {
  fetchAllController,
  createMovieController,
  updateMovieController,
  deleteMovieController,
  getManagerMovies,
  addMovie,
  storageMovie,
  updateMovie,
  editMovie,
  destroyMovie,
  showMovie
}

