/* eslint-disable no-useless-catch */
import { ShowtimeModels } from 'models/showtime.model'
import { MovieModels } from 'models/movie.model'
import { CinemaModels } from 'models/cinema.model'
import ApiError from 'utils/ApiError'
import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'

const InvalidFields = ['_id', 'createdAt', 'updatedAt']
let showtimes = []

const createShowtime = async (data) => {
  try {
    // check if movie and cinema exist
    const [movie, cinema] = await Promise.all([
      MovieModels.findOneById(data.movieId),
      CinemaModels.findOneById(data.cinemaId)
    ])
    if (!movie) throw new ApiError(StatusCodes.NOT_FOUND, 'Movie not found')
    if (!cinema) throw new ApiError(StatusCodes.NOT_FOUND, 'Cinema not found')

    // calculate end time and create showtime
    const newData = {
      ...data,
      end: data.start + Math.floor(movie.duration / 60) + (movie.duration % 60 > 0 ? 1 : 0)
    }
    const result = ShowtimeModels.createShowtime(newData)

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
    const validatedData = { ...data }
    InvalidFields.forEach((field) => {
      delete validatedData[field]
    })

    // check if movie and cinema exist
    let movie = null
    if (validatedData.movieId) {
      movie = await MovieModels.findOneById(validatedData.movieId)
      if (!movie) throw new ApiError(StatusCodes.NOT_FOUND, 'Movie not found')
    }
    if (validatedData.cinemaId) {
      const cinema = await CinemaModels.findOneById(validatedData.cinemaId)
      if (!cinema) throw new ApiError(StatusCodes.NOT_FOUND, 'Cinema not found')
    }

    // calculate end time and update showtime
    if (validatedData.start && movie) {
      validatedData.end = data.start + Math.floor(movie.duration / 60) + (movie.duration % 60 > 0 ? 1 : 0)
    }
    const showtime = await ShowtimeModels.updateShowtime(showtimeId, validatedData)
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

export const ShowtimeServices = {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  fetchAll,
  pushBookedChairs
}