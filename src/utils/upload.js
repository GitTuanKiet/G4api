import fs from 'fs'
import multer from 'multer'
import { StatusCodes } from 'http-status-codes'
import ApiError from './ApiError'

const maxSize = 2*1024*1024
const storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/svg+xml') {
      return cb(new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Only images are allowed'))
    }
    cb(null, true)
  },
  destination: function (req, file, cb) {
    const folder = 'uploads/'

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }

    cb(null, folder)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname +'_'+ Date.now() + '_' + file.originalname)
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: maxSize }
})