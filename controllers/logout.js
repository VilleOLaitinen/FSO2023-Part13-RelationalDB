const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../util/middlewares')

router.delete('/', tokenExtractor, async (req, res, next) => {
  try{
    await Session.destroy({ where: { userId: req.decodedToken.id }})
    return res.json({ message: 'Logout successful' })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

module.exports = router