const mostLikes = require('../utils/list_helper').mostLikes

const blogs = [
  {
    author: 'Maximliano Morales',
    likes: 17
  },
  {
    author: 'Josefina Cabral',
    likes: 80
  },
  {
    author: 'Lionel Messi',
    likes: 3
  }
]

describe('Most likes', () => {
  test('When list has no blogs, equal to 0', () => {
    expect(mostLikes([])).toBe(0)
  })

  test('When the list has one item, equals to be the blog of that', () => {
    expect(mostLikes([blogs[0]])).toEqual(blogs[0])
  })

  test('When the list has many items, equals to be the item with most likes ', () => {
    expect(mostLikes(blogs)).toEqual(blogs[1])
  })
})
