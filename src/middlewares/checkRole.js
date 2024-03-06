

function checkRole (req, res, next) {
  if (req.user.role === 'admin') {
    next()
  } else {
    res.status(403).send('You are not allowed to access this resource')
  }
}

module.exports = checkRole