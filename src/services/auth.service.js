/* eslint-disable no-useless-catch */
import { UserModels } from 'models/user.model'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'
import JWT_CONFIG from 'config/jwt.config'
import MAIL_CONFIG from 'config/mail.config'
import APP_CONFIG from 'config/app.config'
import { sendMail } from 'utils/mailer'
import ApiError from 'utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const { JWT_SECRET, EXPIRES_IN, REFRESH_EXPIRES_IN } = JWT_CONFIG
const { MAIL_USER } = MAIL_CONFIG
const { URL } = APP_CONFIG

const loginService = async (data) => {
  const { email, password } = data
  try {
    // tìm user theo email
    const user = await UserModels.findOneByEmail(email)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found')

    // check email verified
    if (!user.isEmailVerified) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email is not verified')

    // so sánh password
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) throw new ApiError(StatusCodes.NON_AUTHORITATIVE_INFORMATION, 'Password is incorrect')

    // exclude password field
    delete user.password
    // tạo token và trả về
    const token = Jwt.sign(user, JWT_SECRET, { expiresIn: EXPIRES_IN })
    const refreshToken = Jwt.sign({ id:user._id }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN })
    return { token, refreshToken }
  } catch (error) {
    throw error
  }
}

const registerService = async (data) => {
  try {
    // tìm user theo email
    const user = await UserModels.findOneByEmail(data.email)
    if (user) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email already exists')

    // hash password
    const salt = bcrypt.genSaltSync(10)
    data.password = bcrypt.hashSync(data.password, salt)

    // tạo mới user
    const newUser = await UserModels.createUser(data)

    // attach user
    const newlyUserSaved = await UserModels.findOneById(newUser.insertedId)
    delete newlyUserSaved.password

    // tạo verifyEmailToken và gửi email
    const verifyEmailToken = Jwt.sign({ id: newlyUserSaved._id }, JWT_SECRET, { expiresIn: EXPIRES_IN })

    // gửi email
    const mailOptions = {
      from: MAIL_USER,
      to: newlyUserSaved.email,
      subject: 'Verify email',
      html: 'Click <a href="' + URL + '/auth/verify-email/' + verifyEmailToken + '">here</a> to verify email'
    }

    sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}

const verifyEmailService = async (token) => {
  try {
    // verify token
    const decoded = Jwt.verify(token, JWT_SECRET)

    // tìm user theo id
    const user = await UserModels.findOneById(decoded.id)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

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
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found')

    // tạo token và gửi email
    const token = Jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: EXPIRES_IN })

    // gửi email
    const mailOptions = {
      from: MAIL_USER,
      to: user.email,
      subject: 'Reset password',
      html: 'Click <a href="' + URL + '/auth/reset-password/' + token + '">here</a> to reset password'
    }

    sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}

const resetPasswordService = async (token) => {
  try {
    // verify token
    const decoded = Jwt.verify(token, JWT_SECRET)

    // tìm user theo id
    const user = await UserModels.findOneById(decoded.id)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    // hash password
    const salt = bcrypt.genSaltSync(10)
    let password = Math.random().toString(36).substring(7)
    const newPassword = bcrypt.hashSync(password, salt)

    // cập nhật password
    await UserModels.updateUser(decoded.id, { password: newPassword })

    // gửi email
    const mailOptions = {
      from: MAIL_USER,
      to: user.email,
      subject: 'Reset password',
      html: 'Reset password successfully with new password: ' + password
    }

    sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}

const refreshTokenService = async (refreshToken) => {
  try {
    // verify token
    const decoded = Jwt.verify(refreshToken, JWT_SECRET)

    // tìm user theo id
    const user = await UserModels.findOneById(decoded.id)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    delete user.password

    // tạo token mới và trả về
    const token = Jwt.sign(user, JWT_SECRET, { expiresIn: EXPIRES_IN })

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
