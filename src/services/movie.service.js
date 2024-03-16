/* eslint-disable no-useless-catch */
import { MovieModels } from 'models/movie.model'
import { ShowtimeServices } from './showtime.service'
import { slugify } from 'utils/formatters'
import fs from 'fs'
import path from 'path'
import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

let movies = []
let date = new Date()

const fetchAll = async () => {
  try {
    // fetch lại dữ liệu sau mỗi 24h
    const now = new Date()
    if (now - date > 1000 * 60 * 60 * 24) {
      movies.length = 0
      date = new Date()
    }

    if (movies.length) {
      return movies
    }

    const fetch = await MovieModels.fetchAll()
    const fixedMovies = fetch.map((movie) => {
      if (movie.releaseDate <= now && movie.endDate > now) {
        movie.status = 'now showing'
      }
      if (movie.releaseDate > now) {
        movie.status = 'coming soon'
      }
      if (movie.endDate <= now) {
        movie.status = 'ended'
      }
      return movie
    })
    movies = cloneDeep(fixedMovies)

    return movies
  } catch (error) {
    throw error
  }
}

const createMovie = async (data) => {
  try {
    data.slug = slugify(data.title)
    data.trailer = data.trailer.replace('youtu.be', 'www.youtube.com/embed')
    const result = await MovieModels.createMovie(data)

    if (result.acknowledged) {
      movies.length = 0
    }

    const movie = await MovieModels.findOneById(result.insertedId)
    return movie
  } catch (error) {
    throw error
  }
}

const updateMovie = async (movieId, data) => {
  try {
    const check = await MovieModels.findOneById(movieId)
    if (!check) throw new ApiError(StatusCodes.NOT_FOUND, 'Movie not found')

    if (data.title) data.slug = slugify(data.title)
    data.trailer = data.trailer.replace('youtu.be', 'www.youtube.com/embed')

    // if (data.poster) {
    //   const oldPoster = check.poster
    //   if (oldPoster && oldPoster !== data.poster) {
    //     const filePath = path.join('./', oldPoster)
    //     if (fs.existsSync(filePath)) {
    //       await fs.promises.unlink(filePath)
    //     }
    //   }
    // }

    const movie = await MovieModels.updateMovie(movieId, data)

    if (movie) {
      movies.length = 0
    }

    return movie
  } catch (error) {
    throw error
  }
}

const deleteMovie = async (movieId) => {
  try {
    const check = await MovieModels.findOneById(movieId)
    if (!check) throw new ApiError(StatusCodes.NOT_FOUND, 'Movie not found')

    // if (check.poster) {
    //   const filePath = path.join('./', check.poster)
    //   if (fs.existsSync(filePath)) {
    //     await fs.promises.unlink(filePath)
    //   }
    // }

    const [resultMovie, resultShowtime] = await Promise.all([MovieModels.deleteMovie(movieId), ShowtimeServices.deleteManyByMovieId(movieId)])

    if (resultMovie.acknowledged && resultShowtime.acknowledged) {
      movies.length = 0
    }

    return
  } catch (error) {
    throw error
  }
}

export const MovieServices = {
  fetchAll,
  createMovie,
  updateMovie,
  deleteMovie
}