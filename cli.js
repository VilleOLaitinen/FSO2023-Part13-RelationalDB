require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const getBlogs = async () => {
  try {
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    if (blogs.length === 0 || !blogs) {
      console.log('No blogs found')
    } else {
      blogs.forEach((blog) => {
        console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`)
      })
    }
  } catch (error) {
    console.error(error)
  }
}

getBlogs()