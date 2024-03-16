/* eslint-disable no-useless-catch */
import { ShowtimeModels } from 'models/showtime.model'
import { MovieModels } from 'models/movie.model'
import ApiError from 'utils/ApiError'
import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'
import { TheaterModels } from 'models/theater.model'

const InvalidFields = ['_id', 'createdAt', 'updatedAt']
let showtimes = []

const createManyShowtime = async (data) => {
  try {

    // check if movie and theater exist
    const [movie, theater] = await Promise.all([
      MovieModels.findOneById(data.movieId),
      TheaterModels.findOneById(data.theaterId)
    ])

    if (!movie) throw new ApiError(StatusCodes.NOT_FOUND, 'Movie not found')
    if (!theater) throw new ApiError(StatusCodes.NOT_FOUND, 'Theater not found')

    if (data.list_start && !data.list_start.length) throw new ApiError(StatusCodes.BAD_REQUEST, 'List start is required')
    let listStart = data.list_start
    delete data.list_start

    const newData = []
    for (const start of listStart) {
      const startHour = parseInt(start)
      const endHour = startHour + Math.floor(movie.duration / 60) + (movie.duration % 60 > 0 ? 1 : 0)
      newData.push({
        ...data,
        start: startHour,
        end: endHour
      })
    }
    const result = await ShowtimeModels.createManyShowtime(newData)

    // if success, reset showtimes
    if (result.acknowledged) {
      showtimes.length = 0
    }

    // return showtime
    const showtime = await ShowtimeModels.findOneById(result.insertedId)
    return showtime
  } catch (error) {
    throw error
  }
}

const updateShowtime = async (showtimeId, data) => {
  try {
    // remove invalid fields
    const dataRemoved = { ...data }
    InvalidFields.forEach((field) => {
      delete dataRemoved[field]
    })

    // check if movie and theater exist
    let movie = null
    if (dataRemoved.movieId) {
      movie = await MovieModels.findOneById(dataRemoved.movieId)
      if (!movie) throw new ApiError(StatusCodes.NOT_FOUND, 'Movie not found')
    }
    if (dataRemoved.theaterId) {
      const theater = await TheaterModels.findOneById(dataRemoved.theaterId)
      if (!theater) throw new ApiError(StatusCodes.NOT_FOUND, 'Theater not found')
    }

    // calculate end time and update showtime
    if (dataRemoved.start && movie) {
      dataRemoved.end = data.start + Math.floor(movie.duration / 60) + (movie.duration % 60 > 0 ? 1 : 0)
    }

    const newData = {
      ...dataRemoved,
      updatedAt: new Date()
    }
    const showtime = await ShowtimeModels.updateShowtime(showtimeId, newData)
    // if success, reset showtimes
    if (showtime) {
      showtimes.length = 0
    }

    return showtime
  } catch (error) {
    throw error
  }
}

const deleteShowtime = async (showtimeId) => {
  try {
    const result = await ShowtimeModels.deleteShowtime(showtimeId)
    if (result.acknowledged) {
      showtimes.length = 0
    }

    return result
  } catch (error) {
    throw error
  }
}

const fetchAll = async () => {
  try {
    if (showtimes.length) {
      return showtimes
    }

    const fetch = await ShowtimeModels.fetchAll()

    // thêm dateId cho từng showtime dựa theo day
    // nếu day là ngày hiện tại thì dateId = 0
    // những ngày sau thì dateId = 1, 2, 3, ...
    // những ngày trước thì dateId = -1, -2, -3, ...
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    fetch.forEach((showtime) => {
      const date = new Date(showtime.day)
      showtime.dateId = Math.floor((date - today) / (24 * 60 * 60 * 1000))
    })

    showtimes = cloneDeep(fetch)
    return showtimes
  } catch (error) {
    throw error
  }
}

const pushBookedChairs = async (showtimeId, chairs) => {
  if (!chairs.length) throw new ApiError(StatusCodes.BAD_REQUEST, 'Chairs is required')
  try {
    const showtime = await ShowtimeModels.findOneById(showtimeId)
    if (!showtime) throw new ApiError(StatusCodes.NOT_FOUND, 'Showtime not found')

    // check if chairs are booked
    const bookedChairs = showtime.bookedChairs
    const isBooked = chairs.some((chair) => bookedChairs.includes(chair))
    if (isBooked) throw new ApiError(StatusCodes.BAD_REQUEST, 'Chairs are booked')

    const result = await ShowtimeModels.pushBookedChairs(showtimeId, chairs)
    if (result.acknowledged) {
      showtimes.length = 0
    }

    return result
  } catch (error) {
    throw error
  }
}

const deleteManyByMovieId = async (movieId) => {
  try {
    const result = await ShowtimeModels.deleteShowtimeByMovieId(movieId)
    if (result.acknowledged) {
      showtimes.length = 0
    }

    return result
  } catch (error) {
    throw error
  }
}

export const ShowtimeServices = {
  createManyShowtime,
  updateShowtime,
  deleteShowtime,
  fetchAll,
  pushBookedChairs,
  deleteManyByMovieId
}