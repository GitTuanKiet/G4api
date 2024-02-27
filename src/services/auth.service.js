/* eslint-disable no-useless-catch */
import { UserModels } from 'models/user.model'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'
import { ENV } from 'config/environment'
import mailer from 'config/mailer'

const loginService = async (data) => {
  const { email, password } = data
  try {
    // tìm user theo email
    const user = await UserModels.findOneByEmail(email)
    if (!user) throw new Error('Email not found')

    // so sánh password
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) throw new Error('Password is incorrect')

    // exclude password field
    delete user.password
    // tạo token và trả về
    const token = Jwt.sign(user, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })
    const refreshToken = Jwt.sign({}, ENV.JWT_SECRET, { expiresIn: ENV.REFRESH_EXPIRES_IN })
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
    delete newlyUserSaved.password

    // login và trả về token
    const token = Jwt.sign({ user: newlyUserSaved }, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })
    const refreshToken = Jwt.sign({}, ENV.JWT_SECRET, { expiresIn: ENV.REFRESH_EXPIRES_IN })
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
    mailer.sendMail({
      from: ENV.MAIL_USER,
      to: user.email,
      subject: 'Reset password',
      html: 'Click <a href="' + ENV.URL + '/auth/reset-password/' + token + '">here</a> to reset password'
    }, (err, info) => {
      if (err) throw err
      console.log('Email sent: ' + info.response)
    })

  } catch (error) {
    throw error
  }
}

const resetPasswordService = async (token) => {
  try {
    // verify token
    const decoded = Jwt.verify(token, ENV.JWT_SECRET)

    // tìm user theo id
    const user = await UserModels.findOneById(decoded.id)
    if (!user) throw new Error('User not found')

    // hash password
    const salt = bcrypt.genSaltSync(10)
    let password = Math.random().toString(36).substring(7)
    password = bcrypt.hashSync(password, salt)

    // cập nhật password
    await UserModels.updateUser(decoded.id, { password: password })

    mailer.sendMail({
      from: ENV.MAIL_USER,
      to: user.email,
      subject: 'Reset password',
      html: 'Reset password successfully with new password: ' + password
    }, (err, info) => {
      if (err) throw err
      console.log('Email sent: ' + info.response)
    })
  } catch (error) {
    throw error
  }
}

const refreshTokenService = async (data) => {
  try {
    // verify token
    const decoded = Jwt.verify(data.token, ENV.JWT_SECRET)

    // tìm user theo id
    const user = await UserModels.findOneById(decoded.id)
    if (!user) throw new Error('User not found')
    delete user.password

    // tạo token mới và trả về
    const token = Jwt.sign({ user }, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })

    return { token }
  } catch (error) {
    throw error
  }
}

export const AuthServices = {
  loginService,
  registerService,
  forgotPasswordService,
  resetPasswordService,
  refreshTokenService
}
