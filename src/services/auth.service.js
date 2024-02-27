/* eslint-disable no-useless-catch */
import { UserModels } from 'models/user.model'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'
import { ENV } from 'config/environment'
import { sendMail } from 'config/mailer'

const loginService = async (data) => {
  const { email, password } = data
  try {
    // tìm user theo email
    const user = await UserModels.findOneByEmail(email)
    if (!user) throw new Error('Email not found')

    // check email verified
    if (!user.isEmailVerified) throw new Error('Email is not verified')

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

    // tạo verifyEmailToken và gửi email
    const verifyEmailToken = Jwt.sign({ id: newlyUserSaved._id }, ENV.JWT_SECRET, { expiresIn: ENV.EXPIRES_IN })

    // gửi email
    const mailOptions = {
      from: ENV.MAIL_USER,
      to: newlyUserSaved.email,
      subject: 'Verify email',
      html: 'Click <a href="' + ENV.URL + '/auth/verify-email/' + verifyEmailToken + '">here</a> to verify email'
    }

    await sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}

const verifyEmailService = async (token) => {
  try {
    // verify token
    const decoded = Jwt.verify(token, ENV.JWT_SECRET)

    // tìm user theo id
    const user = await UserModels.findOneById(decoded.user)
    if (!user) throw new Error('User not found')

    // cập nhật user
    await UserModels.updateUser(decoded.id, { isEmailVerified: true })
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
    const mailOptions = {
      from: ENV.MAIL_USER,
      to: user.email,
      subject: 'Reset password',
      html: 'Click <a href="' + ENV.URL + '/auth/reset-password/' + token + '">here</a> to reset password'
    }

    await sendMail(mailOptions)
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

    // gửi email
    const mailOptions = {
      from: ENV.MAIL_USER,
      to: user.email,
      subject: 'Reset password',
      html: 'Reset password successfully with new password: ' + password
    }

    await sendMail(mailOptions)
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
  verifyEmailService,
  forgotPasswordService,
  resetPasswordService,
  refreshTokenService
}
