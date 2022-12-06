const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

jest.setTimeout(20000)

const Blog = require('../models/blogs')
const User = require('../models/user')

describe('---- BLOG TESTS ------', () => {
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
})

describe('---- USER TESTS ------', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'maxteria',
      name: 'maximiliano morales',
      password: 'timcup'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with password length less than 3', async () => {
    const newUser = {
      username: 'maxteria',
      name: 'maximiliano morales',
      password: 'ti'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('password must be at least 3 characters long')
  })

  test('creation fails with username length less than 3', async () => {
    const newUser = {
      username: 'ma',
      name: 'maximiliano morales',
      password: 'timcup'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('User validation failed: username: Path `username` (`ma`) is shorter than the minimum allowed length (3).')
  })
})

afterAll(() => {
  mongoose.connection.close()
})