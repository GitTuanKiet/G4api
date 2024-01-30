import express from 'express'

import { Controllers } from 'controllers/exampleController'
import { Validations } from 'validations/exampleValidation'

const router = express.Router()

// truyền qua validator trước khi vào controller
router.route('/create')
  .post(Validations.createExampleValidation, Controllers.exampleCreateController)

router.route('/:id')
  .put(Validations.updateExampleValidation, Controllers.exampleUpdateController)
  .delete(Controllers.exampleDestroyController)

module.exports = router