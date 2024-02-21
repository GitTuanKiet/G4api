import 'dotenv/config'

export const ENV = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,

  MONGO_URL: process.env.MONGO_URL,
  MONGO_DB: process.env.MONGO_DB,

  NODE_ENV: process.env.NODE_ENV,

  JWT_SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.EXPIRES_IN,

  AUTHOR: process.env.AUTHOR
}

