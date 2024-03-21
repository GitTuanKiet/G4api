import express from 'express'

const router = express.Router()

// undefined routes
router.get('/uploads/:file', (req, res) => {
  try {
    res.sendFile(req.params.file, { root: 'uploads' })
  } catch (err) {
    res.status(404).send('File not found')
  }
})

// admin routes
router.use('/admin', require('./admin'))

module.exports = router