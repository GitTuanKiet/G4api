import express from 'express'

const router = express.Router()

router.use('/member-card', require('./member.route'))
router.use('/gift-card', require('./gift.route'))
router.use('/voucher', require('./voucher.route'))
router.use('/coupon', require('./coupon.route'))

module.exports = router