import nodemailer from 'nodemailer'
import { ENV } from './environment'

export default nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: ENV.MAIL_USER,
    pass: ENV.MAIL_PASS
  }
})