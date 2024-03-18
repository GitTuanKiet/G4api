/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import compression from 'compression'
import cor from 'cors'

import configViewEngine from 'utils/viewEngine'

import { connectMongo, disconnectMongo } from 'utils/database/mongodb'
import APP_CONFIG from 'config/app.config'

const { PORT, HOST, AUTHOR, NODE_ENV } = APP_CONFIG

const START_SERVER = () => {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(compression())

  app.use(cor())
  app.use('/v1', require('routes/v1/undefined.route'))

  configViewEngine(app)

  app.use(require('middlewares/cors'))
  app.use('/v1', require('routes/v1'))

  app.use(require('middlewares/errorHandler'))

  if (NODE_ENV === 'development') {
    app.listen(PORT, HOST, () => {
      console.log(`Server started at http://${HOST}:${PORT}`)
      console.log(`Author: ${AUTHOR}`)
    })
  }

  if (NODE_ENV === 'production') {
    app.listen(PORT, () => {
      console.log(`Server started. NODE_ENV: ${NODE_ENV}`, `PORT: ${PORT}`)
      console.log(`Author: ${AUTHOR}`)
    })
  }

  exitHook(() => {
    disconnectMongo()
  })
}

(async () => {
  try {
    await connectMongo()
    START_SERVER()
  } catch (error) {
    console.error('Error starting server: ', error)
    process.exit(1)
  }
})()


