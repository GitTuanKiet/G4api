import { StatusCodes } from 'http-status-codes'
import { ShowtimeServices } from 'services/showtime.service'

const createShowtimeController = async (req, res, next) => {
  try {
    await ShowtimeServices.createManyShowtime(req.body)

    return res.status(StatusCodes.CREATED).json({ message: 'Showtimes created successfully' })
  } catch (error) {
    next(error)
  }
}

const updateShowtimeController = async (req, res, next) => {
  try {
    const { showtimeId } = req.params
    await ShowtimeServices.updateShowtime(showtimeId, req.body)

    return res.status(StatusCodes.OK).json({ message: 'Showtime updated successfully' })
  } catch (error) {
    next(error)
  }
}

const deleteShowtimeController = async (req, res, next) => {
  try {
    const { showtimeId } = req.params
    await ShowtimeServices.deleteShowtime(showtimeId)

    return res.status(StatusCodes.OK).json({ message: 'Showtime deleted successfully' })
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

export const ShowtimeControllers = {
  createShowtimeController,
  updateShowtimeController,
  deleteShowtimeController,
  fetchAllController
}