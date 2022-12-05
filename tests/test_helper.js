const Blog = require('../models/blogs')

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

module.exports = {
  initialBlogs, blogsInDb, noExistingID, existingId
}
