/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { CinemaServices } from 'services/cinema.service'

const fetchAllController = async (req, res, next) => {
  try {
    const cinemas = await CinemaServices.fetchAll()

    return res.status(StatusCodes.OK).json(cinemas)
  } catch (error) {
    next(error)
  }
}

const createCinemaController = async (req, res, next) => {
  try {
    const cinema = await CinemaServices.createCinema(req.body)

    return res.status(StatusCodes.CREATED).json(cinema)
  } catch (error) {
    next(error)
  }
}

const updateCinemaController = async (req, res, next) => {
  try {
    const cinema = await CinemaServices.updateCinema(req.params.cinemaId, req.body)

    return res.status(StatusCodes.OK).json(cinema)
  } catch (error) {
    next(error)
  }
}

export const CinemaControllers = {
  fetchAllController,
  createCinemaController,
  updateCinemaController
}
