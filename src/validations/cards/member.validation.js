import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const registerMemberCard = async (req, res, next) => {
  try {
    const schemaRegisterMemberCard = Joi.object({
      number: Joi.string().required(),
      name: Joi.string().required()
    })

    await schemaRegisterMemberCard.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const MemberCardValidations = {
  registerMemberCard
}