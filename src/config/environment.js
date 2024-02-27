import 'dotenv/config'

export const ENV = {
  // APP
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  URL: process.env.URL,
  AUTHOR: process.env.AUTHOR,
  NODE_ENV: process.env.NODE_ENV,

  // MONGO
  MONGO_URL: process.env.MONGO_URL,
  MONGO_DB: process.env.MONGO_DB,

  // MAILER
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.EXPIRES_IN,
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN,

  // PAYPAL
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  PAYPAL_MODE: process.env.PAYPAL_MODE
}

