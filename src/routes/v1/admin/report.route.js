import express from 'express'

import { ReportControllers } from 'controllers/report.controller'

const router = express.Router()

router.get('/financialReport', ReportControllers.financialReport)
router.get('/ordersReport', ReportControllers.ordersReport)

module.exports = router


