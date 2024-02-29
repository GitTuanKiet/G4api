import express from 'express'
import { upload } from 'utils/upload'
import { UploadControllers } from 'controllers/upload.controller'
import { UploadValidations } from 'validations/upload.validation'
const router = express.Router()

router.route('/avatar')
  .post(upload.single('avatar'), UploadValidations.uploadAvatar, UploadControllers.uploadAvatar)

module.exports = router