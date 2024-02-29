import nodemailer from 'nodemailer'
import MAIL_CONFIG from 'config/mail.config'

const { MAIL_USER, MAIL_PASS } = MAIL_CONFIG

const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
})

export const sendMail = (mailOptions) => {
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