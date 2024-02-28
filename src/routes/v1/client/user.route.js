import express from 'express'

import { UserControllers } from 'controllers/user.controller'
import { UserValidations } from 'validations/user.validation'

const router = express.Router()

router.route('/update-profile')
  .put(UserValidations.updateProfile, UserControllers.updateProfile)

router.route('/change-password')
  .put(UserValidations.changePassword, UserControllers.changePassword)


module.exports = router