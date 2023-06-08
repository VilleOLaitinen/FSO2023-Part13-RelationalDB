const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingListsRouter = require('./controllers/readinglists')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListsRouter)

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

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()