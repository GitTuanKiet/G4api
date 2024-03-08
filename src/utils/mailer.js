import nodemailer from 'nodemailer'
import MAIL_CONFIG from 'config/mail.config'
import { getDOMAIN } from './constants'
const { MAIL_USER, MAIL_PASS } = MAIL_CONFIG
import path from 'path'

const getURL = (url) => {
  const domain = getDOMAIN()
  return path.join(domain, url)
}

const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
})

const sendMail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    })
  })
}

export const sendMailOptions = (user, token, type) => {
  let mailOptions = {}
  switch (type) {
  case 'verifyEmail':
    mailOptions = mailOptionsVerifyEmail(user, token)
    break
  case 'forgotPassword':
    mailOptions = mailOptionsForgotPassword(user, token)
    break
  case 'resetPassword':
    mailOptions = mailOptionsResetPassword(user, token)
    break
  case 'paypalPayment':
    mailOptions = mailOptionsPaypalPayment(user, token)
    break
  default:
    throw new Error('Invalid mail type')
  }

  return sendMail(mailOptions)
}

const mailOptionsVerifyEmail = (user, token) => {
  const mailOptions = {
    from: MAIL_USER,
    to: user.email,
    subject: 'Verify your email address',
    html: `Dear ${user.name}, <br/><br/>
    Thank you for signing up with our service! To complete the registration process, please click the following link to verify your email address:<br/><br/>
    <a href="${getURL(`/auth/verify-email/${token}`)}">Verify Email</a><br/><br/>
    If you did not sign up for our service, please disregard this email.<br/><br/>
    Best regards,<br/>
    The CGV cinema`
  }
  return mailOptions
}

const mailOptionsForgotPassword = (user, token) => {
  const mailOptions = {
    from: MAIL_USER,
    to: user.email,
    subject: 'Reset your password',
    html: `Dear ${user.name}, <br/><br/>
    We received a request to reset your password. If you did not make this request, simply ignore this email. Otherwise, you can reset your password using this link:<br/><br/>
    <a href="${getURL(`/auth/reset-password/${token}`)}">Reset Password</a><br/><br/>
    This link will expire in 1 hour.<br/><br/>
    Best regards,<br/>
    The CGV cinema`
  }
  return mailOptions
}

const mailOptionsResetPassword = (user, password) => {
  const mailOptions = {
    from: MAIL_USER,
    to: user.email,
    subject: 'Reset password',
    html: `Dear ${user.name}, <br/><br/>
    Reset password successfully with new password: ${password}<br/><br/>
    Best regards,<br/>
    The CGV cinema`
  }
  return mailOptions
}

const mailOptionsPaypalPayment = (user, data) => {
  const mailOptions = {
    from: MAIL_USER,
    to: user.email,
    subject: 'Paypal payment',
    html: `Dear ${user.name}, <br/><br/>
    Paypal payment with order id: ${data.id}<br/><br/>
    Information:<br/>
    - Name: ${data.name}<br/>
    - Price: ${data.price}<br/>
    - Type: ${data.type}<br/>
    You can pay with this link: ${data.links[1].href}<br/><br/>
    OR you can use this order id to pay<br/><br/>

    Best regards,<br/>
    The CGV cinema`
  }
  return mailOptions
}