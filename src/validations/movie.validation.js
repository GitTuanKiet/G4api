import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { UPLOAD_REGEX } from 'utils/constants'
import ApiError from 'utils/ApiError'
import path from 'path'


const createMovieValidation = async (req, res, next) => {
  try {
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
        'date.base': 'Ngày phát hành không hợp lệ.'
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
      actors: Joi.string().required().messages({
        'string.empty': 'Diễn viên không được để trống.'
      }),
      directors: Joi.string().required().messages({
        'array.base': 'Đạo diễn không được để trống.'
      })
    })
    await schemaCreateMovie.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    const errorMessages = error.details.map(err => err.message);
    const alertMessage = errorMessages.join('\n');
    const redirectUrl = req.headers.referer || '/';

    const script = `
      <script>
        alert(${JSON.stringify(alertMessage)});
        window.location.href = ${JSON.stringify(redirectUrl)};
      </script>
    `;
    res.send(script);
    
  }
}

const updateMovieValidation = async (req, res, next) => {
  if (req.file) {
    req.body.poster = path.join('/', req.file.path)
  }
  try {
    const schemaUpdateMovie = Joi.object({
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
        'number.base': 'Thời lượng phải là số và không được để trống.'
      }),
      releaseDate: Joi.date().required().messages({
        'date.base': 'Ngày phát hành không hợp lệ.'
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
      actors: Joi.string().required().messages({
        'string.empty': 'Diễn viên không được để trống.'
      }),
      directors: Joi.string().required().messages({
        'array.base': 'Đạo diễn không được để trống.'
      })
    })
    await schemaUpdateMovie.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    const errorMessages = error.details.map(err => err.message);
    const alertMessage = errorMessages.join('\n');
    const redirectUrl = req.headers.referer || '/';

    const script = `
      <script>
        alert(${JSON.stringify(alertMessage)});
        window.location.href = ${JSON.stringify(redirectUrl)};
      </script>
    `;
    res.send(script);
  }
}

export const MovieValidations = {
  createMovieValidation,
  updateMovieValidation
}