/* eslint-disable no-useless-catch */
import { UserModels } from 'models/user.model'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'
import { ENV } from 'config/environment'

const loginService = async (data) => {
  const { email, password } = data
  try {
    // tìm user theo email
    const user = await UserModels.findOneByEmail(email)
    if (!user) throw new Error('Email not found')

    // so sánh password
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) throw new Error('Password is incorrect')

    // const payload = {
    //   id: user._id,
    //   email: user.email,
    //   name: user.name
    // }

    // exclude password field
    delete user.password
    // tạo token và refresh token => trả về
    const token = Jwt.sign(user, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })
    const refreshToken = Jwt.sign(user, ENV.JWT_SECRET, { expiresIn: ENV.REFRESH_EXPIRES_IN })
    return { token, refreshToken }
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

    // attach user

    const newlyUserSaved = await UserModels.findOneById(newUser.insertedId)
    delete user.password

    // login và trả về token và refresh token
    const token = Jwt.sign({ user: newlyUserSaved }, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })
    const refreshToken = Jwt.sign({ user: newlyUserSaved }, ENV.JWT_SECRET, { expiresIn: ENV.REFRESH_EXPIRES_IN })
    return { token, refreshToken }
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
