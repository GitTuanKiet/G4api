import express from 'express'

const router = express.Router()

router.use('/member-card', require('./member.route'))
router.use('/gift-card', require('./gift.route'))

module.exports = router