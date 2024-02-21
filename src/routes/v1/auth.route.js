import express from 'express'

import { AuthControllers } from 'controllers/auth.controller'
import { AuthValidations } from 'validations/auth.validation'

const router = express.Router()

router.route('/login')
  .post(AuthValidations.loginValidation, AuthControllers.loginController)

router.route('/register')
  .post(AuthValidations.registerValidation, AuthControllers.registerController)

router.route('/forgot-password')
  .post(AuthValidations.forgotPasswordValidation, AuthControllers.forgotPasswordController)

module.exports = router