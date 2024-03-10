import express from 'express'
import { upload } from 'utils/upload'

import { UserControllers } from 'controllers/user.controller'
import { UserValidations } from 'validations/user.validation'

import { MemberCardControllers } from 'controllers/member.controller'

const router = express.Router()

router.route('/update-profile')
  .put(UserValidations.updateProfile, UserControllers.updateProfile)

router.route('/avatar')
  .post(upload.single('avatar'), UserValidations.uploadAvatar, UserControllers.uploadAvatar)

router.route('/change-password')
  .put(UserValidations.changePassword, UserControllers.changePassword)

router.route('/setup-pin')
  .put(UserValidations.SetupPIN, UserControllers.SetupPIN)

router.route('/history')
  .get(UserControllers.getHistory)

router.route('/fetch-card')
  .get(UserControllers.fetchAllByUserId)

router.route('/get-member-card')
  .get(MemberCardControllers.getCard)

router.route('/register-member-card')
  .post(UserValidations.registerMemberCard, MemberCardControllers.registerMemberCard)

router.route('/lost-member-card')
  .delete(MemberCardControllers.lostMemberCard)

module.exports = router