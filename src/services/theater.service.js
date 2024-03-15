/* eslint-disable no-useless-catch */
import { TheaterModels } from 'models/theater.model'
import { CinemaModels } from 'models/cinema.model'
import { cloneDeep } from 'lodash'

import ApiError from 'utils/ApiError'
import { StatusCodes } from 'http-status-codes'

let theaters = []

const fetchAll = async () => {
  try {
    if (theaters.length) {
      return theaters
    }
    const fetch = await TheaterModels.fetchAll()
    theaters = cloneDeep(fetch)
    return theaters
  } catch (error) {
    throw error
  }
}

const createTheater = async (data) => {
  try {
    const cinema = await CinemaModels.findOneById(data.cinemaId)
    if (!cinema) throw new ApiError(StatusCodes.NOT_FOUND, 'Cinema not found')

    const result = await TheaterModels.createTheater(data)
    if (result.acknowledged) {
      theaters.length = 0
    }
    return result
  } catch (error) {
    throw error
  }
}

const updateTheater = async (theaterId, data) => {
  try {
    const newData = {
      ...data,
      updatedAt: new Date()
    }
    const result = await TheaterModels.updateTheater(theaterId, newData)
    if (result.acknowledged) {
      theaters.length = 0
    }
    return result
  } catch (error) {
    throw error
  }
}

export const TheaterServices = {
  fetchAll,
  createTheater,
  updateTheater
}