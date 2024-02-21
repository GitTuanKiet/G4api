/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'config/mongodb'
import { fixObjectId } from 'utils/formatters'

const UserCollection = 'users'

const schemaCreateUser = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

/**
 * function validate data trước khi register
 * @param {*} data
 * @returns {Promise<user>}
 */
const validateUser = async (data) => {
  try {
    return await schemaCreateUser.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

/**
 * function tìm user theo email
 * @param {*} email
 * @returns {Promise<user>}
 */
const findOneByEmail = async (email) => {
  try {
    return await getMongo().collection(UserCollection).findOne({ email: email })
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới user
 * @param {*} data
 * @returns {Promise<user>}
 */
const createUser = async (data) => {
  try {
    const value = await validateUser(data)
    return await getMongo().collection(UserCollection).insertOne(value)
  } catch (error) {
    throw error
  }
}

// export các hàm để sử dụng ở controller
export const UserModels = {
  findOneByEmail,
  createUser
}