import nodemailer from 'nodemailer'
import { ENV } from '../config/environment'

export default nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: ENV.MAIL_USER,
    pass: ENV.MAIL_PASS
  }
})

export const sendMail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    nodemailer.createTransport().sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    })
  })
}