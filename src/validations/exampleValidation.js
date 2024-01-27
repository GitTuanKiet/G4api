import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const createExampleValidation = async (req, res, next) => {
  try {
    // dùng joi để validate dữ liệu
    const schemaCreateExample = Joi.object({
      name: Joi.string().min(3).max(33).trim().strict().messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be at most 33 characters long',
        'string.base': 'Name must be a string'
      }),
      age: Joi.number().integer().min(18).max(100).messages({
        'number.min': 'Age must be at least 18',
        'number.max': 'Age must be at most 100',
        'number.base': 'Age must be a number'
      })
    })

    // ổn hết thì next
    await schemaCreateExample.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

// update cũng tương tự
const updateExampleValidation = async (req, res, next) => {
  try {
    const schemaUpdateExample = Joi.object({
      name: Joi.string().min(3).max(33).trim().strict().messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be at most 33 characters long',
        'string.base': 'Name must be a string'
      }),
      age: Joi.number().integer().min(18).max(100).messages({
        'number.min': 'Age must be at least 18',
        'number.max': 'Age must be at most 100',
        'number.base': 'Age must be a number'
      })
    })
    await schemaUpdateExample.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const Validations = {
  createExampleValidation,
  updateExampleValidation
}