// Middleware to verify JWT token
import Jwt from 'jsonwebtoken'
import { ENV } from 'config/environment'

function verifyToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' })
  }

  Jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' })
    }

    req.user = decoded

    next()
  })
}

module.exports = verifyToken