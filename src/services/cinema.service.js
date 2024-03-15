/* eslint-disable no-useless-catch */
import { CinemaModels } from 'models/cinema.model'
import { cloneDeep } from 'lodash'

let cinemas = []

const fetchAll = async () => {
  try {
    if (cinemas.length) {
      return cinemas
    }
    const fetch = await CinemaModels.fetchAll()
    cinemas = cloneDeep(fetch)
    return cinemas
  } catch (error) {
    throw error
  }
}

const createCinema = async (data) => {
  try {
    const result = await CinemaModels.createCinema(data)
    if (result.acknowledged) {
      cinemas.length = 0
    }
    return result
  } catch (error) {
    throw error
  }
}

const updateCinema = async (cinemaId, data) => {
  try {
    const newData = {
      $set: {
        ...data,
        updatedAt: new Date()
      }
    }
    const result = await CinemaModels.updateCinema(cinemaId, newData)
    if (result.acknowledged) {
      cinemas.length = 0
    }
    return result
  } catch (error) {
    throw error
  }
}

export const CinemaServices = {
  fetchAll,
  createCinema,
  updateCinema
}