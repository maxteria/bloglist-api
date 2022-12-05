const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

jest.setTimeout(20000)

const Blog = require('../models/blogs')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('When there is initially some blogs are saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Check properties of blog', () => {
  test('Check the unique identifier id', async () => {
    const validExistingId = await helper.existingId()

    const response = await api.get(`/api/blogs/${validExistingId}`)
    expect(response.body.id).toBeDefined()
  })
})

describe('Addition of a new blog and validate data', () => {
  test('Succeeds blog added with valid data', async () => {
    const newBlog = {
      title: 'Carlos blog',
      author: 'Carlos Sturze',
      url: 'carlos Sturce.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(newBlog.title)

    const authors = blogsAtEnd.map(blog => blog.author)
    expect(authors).toContain(newBlog.author)

    const urls = blogsAtEnd.map(blog => blog.url)
    expect(urls).toContain(newBlog.url)

    const likes = blogsAtEnd.map(blog => blog.likes)
    expect(likes).toContain(newBlog.likes)
  })

  test('Whe there isnt title or url the backed response with bad request 400', async () => {
    const newBlog = {
      author: 'Carlos Sturze',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
