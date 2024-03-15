import { StatusCodes } from 'http-status-codes'
import { ShowtimeServices } from 'services/showtime.service'

import { omit } from 'lodash'

const createShowtimeController = async (req, res, next) => {
  try {
    const showtime = await ShowtimeServices.createShowtime(req.body)
    return res.status(StatusCodes.OK).json(showtime)
  } catch (error) {
    next(error)
  }
}

const updateShowtimeController = async (req, res, next) => {
  try {
    const { showtimeId } = req.params
    const showtime = await ShowtimeServices.updateShowtime(showtimeId, req.body)

    return res.status(StatusCodes.OK).json(showtime)
  } catch (error) {
    next(error)
  }
}

const deleteShowtimeController = async (req, res, next) => {
  try {
    const { showtimeId } = req.params
    await ShowtimeServices.deleteShowtime(showtimeId)
    return res.status(StatusCodes.OK).json({ message: 'Delete showtime successfully' })
  } catch (error) {
    next(error)
  }
}

const fetchAllController = async (req, res, next) => {
  try {
    const result = await ShowtimeServices.fetchAll()
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

import { ShowtimeModels } from 'models/showtime.model'
import { CinemaModels } from 'models/cinema.model'
import { MovieModels } from 'models/movie.model'

//create
const addShowtime = async(req, res) => {
  const movies = await MovieModels.listMovieNameId()
  const cinemas = await CinemaModels.listCinemaNameId()

  return res.render('add-showtime.ejs', { movies, cinemas })
}

const storageShowtime = async (req, res, next) => {
  try {
    const formData = omit(req.body, 'list_start')
    const movie = await MovieModels.findOneById(formData.movieId)
    let Liststart = req.body.list_start

    if (typeof(Liststart)=='string')
    {Liststart = Liststart.split(',')}

    for (const start of Liststart) {
      const startHour = parseInt(start)
      const endHour = startHour + Math.floor(movie.duration / 60) + (movie.duration % 60 > 0 ? 1 : 0)
      formData.end = endHour
      formData.start = start
      await ShowtimeModels.createShowtime(formData)
    }
    res.redirect('/manager-showtime')
  } catch (error) {
    next(error)
  }
}

//edit
const editShowtime = async(req, res) =>
{
  const movies = await MovieModels.listMovieNameId()
  const cinemas = await CinemaModels.listCinemaNameId()
  const showtimeId =req.params.id
  const showtime = await ShowtimeModels.findOneById(showtimeId)

  return res.render('edit-showtime.ejs', { movies, cinemas, showtime })

}
//update
const updateShowtime = async (req, res, next) => {
  try {
    const formData = req.body
    const showtimeId = req.params.id
    const movie = await MovieModels.findOneById(formData.movieId)
    formData.start = parseInt(formData.start)
    formData.end = formData.start + Math.floor(movie.duration / 60) + (movie.duration % 60 > 0 ? 1 : 0)

    await ShowtimeModels.updateShowtime(showtimeId, formData)
    res.redirect('/manager-showtime')
  } catch (error) {
    next(error)
  }
}

const destroyShowtime = async (req, res, next) => {
  // xử lý delete
  try {
    const showtimeID = req.params.id
    await ShowtimeModels.deleteShowtime(showtimeID)
      .then(() => res.redirect('/manager-showtime') )
  } catch (error) {
    next(error)
  }
}

const getManagerShowtime = async (req, res, next) => {
  try {
    const showtimes = await ShowtimeModels.listShowtime()
    for (const showtime of showtimes) {
      const nameCinema = await CinemaModels.findOneById(showtime.cinemaId)
      const nameMovie = await MovieModels.findOneById(showtime.movieId)
      showtime.nameCinema = nameCinema.name
      showtime.nameMovie = nameMovie.title
    }

    res.render('manager-showtime.ejs', { showtimes } )
  } catch (error) {
    next(error)
  }
}

export const ShowtimeControllers = {
  createShowtimeController,
  updateShowtimeController,
  deleteShowtimeController,
  fetchAllController,
  getManagerShowtime,
  addShowtime,
  storageShowtime,
  editShowtime,
  updateShowtime,
  destroyShowtime
}