const mostBlogs = require('../utils/list_helper').mostBlogs

const blogs = [
  {
    author: 'Michael Chan',
    blogs: 3
  },
  {
    author: 'Edsger W. Dijkstra',
    blogs: 2
  },
  {
    author: 'Robert C. Martin',
    blogs: 3
  }
]

describe('most blogs', () => {
  test('when list has not blogs, equals to 0', () => {
    expect(mostBlogs([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = mostBlogs([blogs[0]])
    expect(result).toEqual(blogs[0])
  })

  test('when list has multiple blogs equals the blog with most likes', () => {
    const result = mostBlogs(blogs)
    expect(result).toEqual(blogs[2])
  })
})

// Path: utils\list_helper.js
