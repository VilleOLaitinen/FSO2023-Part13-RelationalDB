const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const errorHandler = (error, req, res, next) => {
  console.error('Error handling MW says: ', error.message)
  const statusCode = error.statusCode || error.status || 500;
  res.status(statusCode);
  if (error.message.includes('Validation isEmail on username failed')) {
    console.error('Error handling MW says: ', error.message, '| Username must be a valid email address.')
    res.json({error: {message: 'Username must be a valid email address.'}})
  } else if (error.message.includes('Validation min on year failed') || error.message.includes('Validation max on year failed')) {
    console.error('Error handling MW says: ', error.message, '| Year must be over 1991 and not over the current year')
    res.json({error: {message: 'Year must be over 1991 and not over the current year'}})
  } else {
  console.error('Error handling MW says: ', error.message)
  res.json({error: {message: error.message}})
  }
}

module.exports = { tokenExtractor, errorHandler }