import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { UPLOAD_REGEX } from 'utils/constants'
import ApiError from 'utils/ApiError'
import path from 'path'


const createMovieValidation = async (req, res, next) => {
  try {
    let { actors, directors, ageRestriction, duration } = req.body
    req.body.ageRestriction = parseInt(ageRestriction)
    req.body.duration = parseInt(duration)
    // Xử lý chuỗi actors và directors trước khi validation
    actors = actors.replace(/^,|,$/g, '').split(',').map(actor => actor.trim())
    directors = directors.replace(/^,|,$/g, '').split(',').map(director => director.trim())
    req.body.releaseDate = new Date(req.body.releaseDate)
    req.body.endDate = new Date(req.body.endDate)
    req.body.actors = actors
    req.body.directors = directors
    const schemaCreateMovie = Joi.object({
      title: Joi.string().required().messages({
        'string.empty': 'Tiêu đề không được phép để trống.'
      }),
      description: Joi.string().required().messages({
        'string.empty': 'Mô tả không được phép để trống.'
      }),
      ageRestriction: Joi.number().valid(0, 13, 16, 18).required().messages({
        'any.only': 'Giới hạn tuổi phải là 0, 13, 16 hoặc 18.'
      }),
      duration: Joi.number().min(30).required().messages({
        'number.base': 'Thời lượng phải là số.',
        'number.min': 'Thời lượng phải là số lớn hơn 30'
      }),
      releaseDate: Joi.date().required().messages({
        'date.base': 'Ngày phát hành không được để trống'
      }),
      endDate: Joi.date().required().messages({
        'date.base': 'Ngày dừng chiếu không được để trống'
      }),
      poster: Joi.string().required().messages({
        'string.empty': 'Poster không được phép để trống.'
      }),
      trailer: Joi.string().required().messages({
        'string.empty': 'Trailer không được phép để trống.'
      }),
      language: Joi.string().required().messages({
        'string.empty': 'Ngôn ngữ không được phép để trống.'
      }),
      genres: Joi.required().messages({
        'any.required': 'Thể loại không được phép để trống.'
      }),
      actors: Joi.array().items(Joi.string()).min(1).required().messages({
        'array.base': 'Diễn viên không được để trống.',
        'array.min': 'Diễn viên không được để trống.'
      }),
      directors: Joi.array().items(Joi.string()).min(1).required().messages({
        'array.base': 'Đạo diễn không được để trống.',
        'array.min': 'Đạo diễn không được để trống.'
      })
    })
    await schemaCreateMovie.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
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

const updateMovieValidation = async (req, res, next) => {
  if (req.file) {
    req.body.poster = path.join('/', req.file.path)
  }
  try {
    let { actors, directors, ageRestriction, duration } = req.body
    req.body.ageRestriction = parseInt(ageRestriction)
    req.body.duration = parseInt(duration)
    // Xử lý chuỗi actors và directors trước khi validation
    actors = actors.replace(/^,|,$/g, '').split(',').map(actor => actor.trim())
    directors = directors.replace(/^,|,$/g, '').split(',').map(director => director.trim())
    req.body.releaseDate = new Date(req.body.releaseDate)
    req.body.endDate = new Date(req.body.endDate)
    req.body.actors = actors
    req.body.directors = directors
    const schemaCreateMovie = Joi.object({
      title: Joi.string().required().messages({
        'string.empty': 'Tiêu đề không được phép để trống.'
      }),
      description: Joi.string().required().messages({
        'string.empty': 'Mô tả không được phép để trống.'
      }),
      ageRestriction: Joi.number().valid(0, 13, 16, 18).required().messages({
        'any.only': 'Giới hạn tuổi phải là 0, 13, 16 hoặc 18.'
      }),
      duration: Joi.number().required().messages({
        'number.base': 'Thời lượng phải là số.'
      }),
      releaseDate: Joi.date().required().messages({
        'date.base': 'Ngày phát hành không được để trống'
      }),
      endDate: Joi.date().required().messages({
        'date.base': 'Ngày dừng chiếu không được để trống'
      }),
      poster: Joi.string().required().messages({
        'string.empty': 'Poster không được phép để trống.'
      }),
      trailer: Joi.string().required().messages({
        'string.empty': 'Trailer không được phép để trống.'
      }),
      language: Joi.string().required().messages({
        'string.empty': 'Ngôn ngữ không được phép để trống.'
      }),
      genres: Joi.required().messages({
        'any.required': 'Thể loại không được phép để trống.'
      }),
      actors: Joi.array().items(Joi.string()).required().messages({
        'string.empty' : 'Diễn viên không được để trống.'
      }),
      directors: Joi.array().items(Joi.string()).min(1).required().messages({
        'string.empty' : 'Đạo diễn không được để trống.'
      })
    })
    await schemaCreateMovie.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
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

export const MovieValidations = {
  createMovieValidation,
  updateMovieValidation
}