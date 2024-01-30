import { StatusCodes } from 'http-status-codes'
import { exampleService } from 'services/exampleService.js'


const exampleCreateController = async (req, res, next) => {
  try {
    const result = await exampleService.createExample(req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const exampleUpdateController = async (req, res, next) => {
  try {
    const result = await exampleService.updateExample(req.params.id, req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const exampleDestroyController = async (req, res, next) => {
  try {
    const result = await exampleService.destroyExample(req.params.id)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}


export const Controllers = {
  exampleCreateController,
  exampleUpdateController,
  exampleDestroyController
}