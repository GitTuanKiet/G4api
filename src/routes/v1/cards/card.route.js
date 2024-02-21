import express from 'express'

const router = express.Router()

router.use('/member-card', require('./member.route'))

module.exports = router