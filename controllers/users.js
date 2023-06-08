const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const blogqueryhelper = require('./util')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId']}
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res, next) => {
  try {
      const user = await User.findByPk(req.params.id, {
      attributes: ['name', 'username'],
      include: [
        blogqueryhelper(req.query.read)
      ],
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user)
} catch (error) {
  next(error)
}
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    error.statusCode = 400
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
  const user = await User.findOne({ where:{ username: req.params.username } })
  if(user) {
    user.name = req.body.name
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
  } catch (error) {
    next(error)
  }
})

module.exports = router