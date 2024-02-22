/* eslint-disable no-useless-catch */
import { UserModels } from 'models/user.model'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'
import { ENV } from 'config/environment'

const loginService = async (data) => {
  try {
    // tìm user theo email
    const user = await UserModels.findOneByEmail(data.email)
    if (!user) throw new Error('Email not found')

    // so sánh password
    const isMatch = bcrypt.compareSync(data.password, user.password)
    if (!isMatch) throw new Error('Password is incorrect')

    // tạo token và trả về
    const token = Jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })

    return { token }
  } catch (error) {
    throw error
  }
}

const registerService = async (data) => {
  try {
    // tìm user theo email
    const user = await UserModels.findOneByEmail(data.email)
    if (user) throw new Error('Email already exists')

    // hash password
    const salt = bcrypt.genSaltSync(10)
    data.password = bcrypt.hashSync(data.password, salt)

    // tạo mới user
    const newUser = await UserModels.createUser(data)

    // login và trả về token
    const token = Jwt.sign({ id: newUser.insertedId }, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })

    return { token }
  } catch (error) {
    throw error
  }
}

const forgotPasswordService = async (data) => {
  try {
    // tìm user theo email
    const user = await UserModels.findOneByEmail(data.email)
    if (!user) throw new Error('Email not found')

    // tạo token và gửi email
    const token = Jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })

    // gửi email
    // ...

    return { token }
  } catch (error) {
    throw error
  }
}

const refreshTokenService = async (data) => {
  try {
    // verify token
    const decoded = Jwt.verify(data.token, ENV.JWT_SECRET)

    // tạo token mới và trả về
    const token = Jwt.sign({ id: decoded.id }, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })

    return { token }
  } catch (error) {
    throw error
  }
}

export const AuthServices = {
  loginService,
  registerService,
  forgotPasswordService,
  refreshTokenService
}