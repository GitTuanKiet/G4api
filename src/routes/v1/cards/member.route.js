import express from 'express'

import { MemberCardControllers } from 'controllers/cards/member.controller'
import { MemberCardValidations } from 'validations/cards/member.validation'

const router = express.Router()

router.route('/register')
  .post(MemberCardValidations.registerMemberCard, MemberCardControllers.registerMemberCard)


module.exports = router