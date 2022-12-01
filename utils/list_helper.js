const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0) || 0
}

const favoriteBlog = (blogs) => {
  const reducer = (max, item) => {
    return max.likes > item.likes ? max : item
  }

  return blogs.reduce(reducer, 0) || 0
}

const mostBlogs = (blogs) => {
  const reducer = (max, item) => {
    return max.blogs > item.blogs ? max : item
  }

  return blogs.reduce(reducer, 0)
}

const mostLikes = (blogs) => {
  const reducer = (max, item) => {
    return max.likes > item.likes ? max : item
  }

  return blogs.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
