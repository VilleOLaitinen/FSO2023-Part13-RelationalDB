const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res, next) => {
  try {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
      [sequelize.fn('count', sequelize.col('*')), 'blogs']
    ],
    group: ['author']
  })
  res.json(authors)
} catch (error) {
  next(error)
}})


module.exports = router