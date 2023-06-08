const router = require('express').Router()
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middlewares')
const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {...where, [Op.or]: [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    ]}
  }

  const blogs = await Blog.findAll({
    order: [['likes', 'DESC']],
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    console.log(req.body)
    const blog = await Blog.create({...req.body, userId: user.id })
    res.json(blog)
  } catch(error) {
    error.statusCode = 400
    next(error)
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (req.blog) {
    const user = await User.findByPk(req.decodedToken.id)
    if (user.id === req.blog.userId) {
      await req.blog.destroy()
      res.status(204).end()
    } else {
      return res.status(403).json({ error: 'You are not authorized to delete this blog' })
    }
  } else {
    res.status(204).end()
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    const error = new Error(`Could not find a blog with given id`)
    error.statusCode = 404
    next(error)
  }
} catch (error) {
  next(error)
}})

module.exports = router