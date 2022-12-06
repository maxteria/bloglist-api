const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'Masxterias blog',
    author: 'Maximiliano Morales',
    url: 'https://maximilianomorales.com',
    likes: 7
  },
  {
    title: 'Josefinas blog',
    author: 'Josefina Cabral',
    url: 'https://josefinacabral.com',
    likes: 12
  }
]

const existingId = async () => {
  const blog = new Blog({
    title: 'Moras blog',
    author: 'Mora Cabral',
    url: 'morasblog.com',
    likes: 12
  })

  await blog.save()
  return blog._id.toString()
}

const noExistingID = async () => {
  const blog = new Blog({
    title: 'Moras blog',
    author: 'Mora Cabral',
    url: 'morasblog.com',
    likes: 12
  })

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getToken = async () => {
  const user = await User.findOne({
    username: 'root'
  })

  const userForToken = {
    username: user.username,
    id: user._id
  }

  return jwt.sign(userForToken, process.env.SECRET)
}

module.exports = {
  initialBlogs, blogsInDb, noExistingID, existingId, usersInDb, getToken
}
