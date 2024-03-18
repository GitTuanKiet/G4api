import { StatusCodes } from 'http-status-codes'
import { ShowtimeServices } from 'services/showtime.service'
import { CinemaServices } from 'services/cinema.service'
import { MovieServices } from 'services/movie.service'
import { TheaterServices } from 'services/theater.service'
import { getActionAd } from 'utils/constants'
import { fixString } from 'utils/formatters'

const createShowtimeController = async (req, res, next) => {
  try {
    await ShowtimeServices.createManyShowtime(req.body)

    return res.redirect(getActionAd('showtime/manager-showtimes'));
  } catch (error) {
    next(error)
  }
}

const updateShowtimeController = async (req, res, next) => {
  try {
    const { showtimeId } = req.params
    await ShowtimeServices.updateShowtime(showtimeId, req.body)

    return res.redirect(getActionAd('showtime/manager-showtimes'));
  } catch (error) {
    next(error)
  }
}

const deleteShowtimeController = async (req, res, next) => {
  try {
    const { showtimeId } = req.params
    await ShowtimeServices.deleteShowtime(showtimeId)

    return res.redirect(getActionAd('showtime/manager-showtimes'));
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

//create
const addShowtime = async(req, res) => {
  const movies = await MovieServices.fetchAll()
  const cinemas = await CinemaServices.fetchAll()
  const theaters = await TheaterServices.fetchAll()

  return res.render('add-showtime.ejs', { movies, cinemas, theaters, getActionAd })
}

//edit
const editShowtime = async(req, res, next) =>
{
  try {
    const { showtimeId } = req.params

    const movies = await MovieServices.fetchAll()
    const cinemas = await CinemaServices.fetchAll()
    const theaters = await TheaterServices.fetchAll()
    const showtimes = await ShowtimeServices.fetchAll()

    const showtime = showtimes.find((showtime) => fixString(showtime._id) === showtimeId)

    return res.render('edit-showtime.ejs', { movies, cinemas, showtime, theaters, getActionAd })
  } catch (error) {
    next(error)
  }
}

const getManagerShowtime = async (req, res, next) => {
  try {
    const showtimes = await ShowtimeServices.fetchAll()
    const movies = await MovieServices.fetchAll()
    const cinemas = await CinemaServices.fetchAll()
    const theaters = await TheaterServices.fetchAll()

    for (const showtime of showtimes) {
      const movie = movies.find((movie) => fixString(movie._id) === fixString(showtime.movieId))
      const theater = theaters.find((theater) => fixString(theater._id) === fixString(showtime.theaterId))
      const cinema = cinemas.find((cinema) => fixString(cinema._id) === fixString(theater.cinemaId))
      showtime.nameCinema = cinema.name
      showtime.nameMovie = movie.title
      showtime.nameTheater = theater.name
    }

    return res.render('manager-showtime.ejs', { showtimes, getActionAd } )
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
  editShowtime
}