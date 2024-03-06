/* eslint-disable no-useless-catch */
import { MovieModels } from 'models/movie.model'
import { slugify } from 'utils/formatters'
import fs from 'fs'
import path from 'path'
import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

let movies = []

const fetchAll = async () => {
  try {
    if (movies.length) {
      return movies
    }
    const fetch = await MovieModels.fetchAll()
    const now = new Date()
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
    const validatedData = await MovieModels.validateMovie(data)
    const result = await MovieModels.createMovie(validatedData)

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

    if (data.title) {
      data.slug = slugify(data.title)
    }

    if (data.poster) {
      if (check.poster && check.poster !== data.poster) {
        const filePath = path.join('./', check.poster)
        await fs.promises.unlink(filePath)
      }
    }

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

    if (check.poster) {
      const filePath = path.join('./', check.poster)
      await fs.promises.unlink(filePath)
    }

    const result = await MovieModels.deleteMovie(movieId)
    if (result.acknowledged) {
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