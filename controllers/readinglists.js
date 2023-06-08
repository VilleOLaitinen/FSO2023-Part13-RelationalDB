const router = require('express').Router()
const { ReadingList, User } = require('../models')
const { tokenExtractor } = require('../util/middlewares')

router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body
    if(!userId || !blogId) {
      return res.status(400).json({ error: 'userId and blogId are required'})
    } else {
      console.log('userId:', userId, 'blogId:', blogId)
      const newList = await ReadingList.create({userId, blogId})

      res.status(201).json(newList)
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const readList = await ReadingList.findByPk(req.params.id)
    if (!user || !readList) {
      return res.status(404).json({error: 'User or ReadList not found'})
    } else if ( readList.userId !== user.id) {
      return res.status(403).json({ error: 'You are not authorized to edit this readlist' })
    } else {
      if (req.body.read === true) {
        readList.read = true;
        await readList.save()
        res.json(readList)
      } else {
        res.status(400).json({ error: 'Read parameter must be "true" to mark a blog as read'})
      }
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router