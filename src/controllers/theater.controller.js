/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { TheaterServices } from 'services/theater.service'

const fetchAllController = async (req, res, next) => {
  try {
    const theaters = await TheaterServices.fetchAll()

    return res.status(StatusCodes.OK).json(theaters)
  } catch (error) {
    next(error)
  }
}

const createTheaterController = async (req, res, next) => {
  try {
    const theater = await TheaterServices.createTheater(req.body)

    return res.status(StatusCodes.CREATED).json(theater)
  } catch (error) {
    next(error)
  }
}

const updateTheaterController = async (req, res, next) => {
  try {
    const { theaterId } = req.params
    const theater = await TheaterServices.updateTheater(theaterId, req.body)

    return res.status(StatusCodes.OK).json(theater)
  } catch (error) {
    next(error)
  }
}

export const TheaterControllers = {
  fetchAllController,
  createTheaterController,
  updateTheaterController
}
