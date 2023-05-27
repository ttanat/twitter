import User from "~~/server/models/user"

export default defineEventHandler(async event => {
  const { q } = getQuery(event)
  if (!q) {
    return createError({ statusCode: 400 })
  }

  const users = await User.find(
    { $text: { $search: q.toString() }, isDeleted: false, isSuspended: false },
    { username: 1, name: 1, image: 1, bio: 1 },
    { sort: { numFollowers: -1 }, limit: 50 },
  ).exec()

  return users
})
