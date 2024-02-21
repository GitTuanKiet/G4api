import express from 'express'

import { AuthControllers } from 'controllers/auth.controller'
import { AuthValidations } from 'validations/auth.validation'

const router = express.Router()

router.route('/login')
  .post(AuthValidations.loginValidation, AuthControllers.loginController)

router.route('/register')
  .post(AuthValidations.registerValidation, AuthControllers.registerController)
module.exports = router