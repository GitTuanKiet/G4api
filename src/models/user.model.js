import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE, UPLOAD_REGEX } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'

const UserCollection = 'users'

const schemaCreateUser = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().regex(/^[0-9]{10}$/).default(''),
  city: Joi.string().default(''),
  address: Joi.string().default(''),
  gender: Joi.string().valid('male', 'female', 'none').default('none'),
  avatar: Joi.string().pattern(UPLOAD_REGEX),
  birthday: Joi.string().isoDate().required(),
  memberCardId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).default(''),
  role: Joi.string().valid('user', 'admin').default('user'),
  POINTS: Joi.number().default(0),
  PIN: Joi.number().default(0),
  isEmailVerified: Joi.boolean().default(false),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

const validateUser = async (data) => await schemaCreateUser.validateAsync(data, { abortEarly: false })
const findOneById = async (userId) => await getMongo().collection(UserCollection).findOne({ _id: fixObjectId(userId) })
const findOneByEmail = async (email) => await getMongo().collection(UserCollection).findOne({ email: email })
const createUser = async (data) => {
  const validateData = await validateUser(data)

  return await getMongo().collection(UserCollection).insertOne(validateData)
}
const updateUser = async (userId, data) => await getMongo().collection(UserCollection).findOneAndUpdate({ _id: fixObjectId(userId) }, { $set: data }, { returnDocument: 'after' })

export const UserModels = {
  findOneById,
  findOneByEmail,
  createUser,
  updateUser
}