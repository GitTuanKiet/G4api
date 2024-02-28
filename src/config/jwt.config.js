import 'dotenv/config'

export default {
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.EXPIRES_IN,
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN
}

