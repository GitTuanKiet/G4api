import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const createShowtimeValidation = async (req, res, next) => {
  try {
    let { list_start, price } = req.body
    req.body.price = parseInt(price)
    if (typeof(list_start) == 'string')
      list_start = list_start.split(',')
    req.body.list_start = list_start
    req.body.day = new Date(req.body.day)

    const schemaCreateShowtime = Joi.object({
      movieId: Joi.string()
        .pattern(OBJECT_ID_REGEX)
        .message(OBJECT_ID_MESSAGE)
        .required()
        .messages({
          'any.required': 'Phim không được để trống',
          'string.pattern.base': 'Phim không hợp lệ'
        }),
      theaterId: Joi.string()
        .pattern(OBJECT_ID_REGEX)
        .message(OBJECT_ID_MESSAGE)
        .required()
        .messages({
          'any.required': 'Rạp chiếu không được để trống.',
          'string.pattern.base': 'Rạp chiếu không hợp lệ'
        }),
      day: Joi.date()
        .required()
        .messages({
          'any.required': 'Ngày chiếu không được để trống.'
        }),
      list_start: Joi.array().items().required().messages(
        { 'array.base': 'Giờ bắt đầu không được để trống.' }
      ),
      price: Joi.number()
        .required()
        .messages({
          'any.required': 'Giá suất chiếu không được để trống.',
          'number.base': 'Giá suất chiếu phải là một số.'
        })
    })

    await schemaCreateShowtime.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    const errorMessages = error.details.map(err => err.message)
    const alertMessage = errorMessages.join('\n')
    const redirectUrl = req.headers.referer || '/'

    const script = `
      <script>
        alert(${JSON.stringify(alertMessage)});
        window.location.href = ${JSON.stringify(redirectUrl)};
      </script>
    `
    res.send(script)
  }
}

const updateShowtimeValidation = async (req, res, next) => {
  try {
    let { start, price } = req.body
    req.body.start = parseInt(start)
    req.body.price = parseInt(price)
    req.body.day = new Date(req.body.day)

    const schemaCreateShowtime = Joi.object({
      movieId: Joi.string()
        .pattern(OBJECT_ID_REGEX)
        .message(OBJECT_ID_MESSAGE)
        .required()
        .messages({
          'any.required': 'Phim không được để trống',
          'string.pattern.base': 'Phim không hợp lệ'
        }),
      theaterId: Joi.string()
        .pattern(OBJECT_ID_REGEX)
        .message(OBJECT_ID_MESSAGE)
        .required()
        .messages({
          'any.required': 'Rạp chiếu không được để trống.',
          'string.pattern.base': 'Rạp chiếu không hợp lệ'
        }),
      day: Joi.date()
        .required()
        .messages({
          'any.required': 'Ngày chiếu không được để trống.',
          'date.base': 'Ngày chiếu phải là một ngày hợp lệ.'
        }),
      start: Joi.number()
        .integer()
        .min(7)
        .max(20)
        .required()
        .messages({
          'any.required': 'Giờ chiếu không được để trống.',
          'number.base': 'Giờ chiếu phải là một số nguyên.',
          'number.integer': 'Giờ chiếu phải là một số nguyên.',
          'number.min': 'Giờ chiếu phải từ 7 trở lên.',
          'number.max': 'Giờ chiếu phải ít hơn hoặc bằng 20.'
        }),
      price: Joi.number()
        .required()
        .messages({
          'any.required': 'Giá suất chiếu không được để trống.',
          'number.base': 'Giá suất chiếu phải là một số.'
        })
    })

    await schemaCreateShowtime.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    const errorMessages = error.details.map(err => err.message)
    const alertMessage = errorMessages.join('\n')
    const redirectUrl = req.headers.referer || '/'

    const script = `
      <script>
        alert(${JSON.stringify(alertMessage)});
        window.location.href = ${JSON.stringify(redirectUrl)};
      </script>
    `
    res.send(script)
  }
}

export const ShowtimeValidations = {
  createShowtimeValidation,
  updateShowtimeValidation
}