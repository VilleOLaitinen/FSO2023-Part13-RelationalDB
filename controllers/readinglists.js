const router = require('express').Router()
const { ReadingList } = require('../models')

router.post('/', async (req, res) => {
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
    console.log(error)
  }
})

module.exports = router