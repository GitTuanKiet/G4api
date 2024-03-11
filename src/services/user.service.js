/* eslint-disable no-useless-catch */
import { UserModels } from 'models/user.model'
import { OrderModels } from 'models/order.model'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'
import Jwt from 'jsonwebtoken'
import JWT_CONFIG from 'config/jwt.config'

const { JWT_SECRET, EXPIRES_IN } = JWT_CONFIG

// những field không được phép update
const InvalidFields = ['_id', 'password', 'role', 'createdAt', 'updatedAt']

const updateProfile = async (userId, data) => {
  // xóa những field không được phép update
  for (const key in data) {
    if (InvalidFields.includes(key)) {
      delete data[key]
    }
  }
  try {
    // tìm user theo id
    const check = await UserModels.findOneById(userId)
    if (!check) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    // nếu thay avatar thì xóa avatar cũ trong uploads
    if (data.avatar) {
      const oldAvatar = check?.avatar
      if (oldAvatar && oldAvatar !== data.avatar) {
        const filePath = path.join('./', oldAvatar)
        // check if exists file
        if (fs.existsSync(filePath)) {
          // remove file if
          await fs.promises.unlink(filePath)
        }
      }
    }

    // update thông tin user
    const updateData = { ...data, updatedAt: new Date() }
    const user = await UserModels.updateUser(userId, updateData)

    // tạo lại token với thông tin mới
    delete user.password
    const accessToken = Jwt.sign(user, JWT_SECRET, { expiresIn: EXPIRES_IN })

    return accessToken
  } catch (error) {
    throw error
  }
}

const changePassword = async (userId, data) => {
  try {
    // tìm user theo id
    const user = await UserModels.findOneById(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    // so sánh password
    const isMatch = bcrypt.compareSync(data.oldPassword, user.password)
    if (!isMatch) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Old password is incorrect')

    // hash new password và update
    const salt = bcrypt.genSaltSync(10)
    const newPassword = bcrypt.hashSync(data.newPassword, salt)
    const updateData = { password: newPassword, updatedAt: new Date() }

    return await UserModels.updateUser(userId, updateData)
  } catch (error) {
    throw error
  }
}

const SetupPIN = async (userId, data) => {
  try {
    // tìm user theo id
    const user = await UserModels.findOneById(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    return await UserModels.updateUser(userId, { PIN: data.newPIN, updatedAt: new Date() })
  } catch (error) {
    throw error
  }
}

const getHistory = async (userId) => {
  try {
    const orderHistory = await OrderModels.findManyByUserId(userId)

    // map theo order
    const data = {
      ticket: [],
      voucher: [],
      gift: [],
      other: []
    }
    orderHistory.forEach(item => {
      if (!item.order) item.type = 'other'
      if (!data[item.order]) data[item.order] = [item]
      else data[item.order] = [...data[item.order], item]
    })

    return data
  } catch (error) {
    throw error
  }
}

export const UserServices = {
  updateProfile,
  changePassword,
  SetupPIN,
  getHistory
}