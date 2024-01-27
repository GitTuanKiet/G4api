import e from 'express'
import express from 'express'
import multer from 'multer'

// import { exampleController } from '~/controllers/exampleController'
// import { exampleValidation } from '~/validators/exampleValidation'

// multer để upload file
const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

// truyền qua validator trước khi vào controller
router.route('/create')
  .post(upload.single('cover'),
    exampleValidation.createExampleValidation,
    exampleController.createExampleController)

router.route('/:id')
  .put(exampleValidation.updateExampleValidation, exampleController.updateExampleController)
  .delete(exampleController.destroyExampleController)

module.exports = router