import User, { ci } from "~~/server/models/user"
import { checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }

  // Get user from database
  const user = await User.findOne({ username }, {
    _id: 1,
    name: 1,
  }).collation(ci).exec()
  // Check if user exists
  if (!user) {
    return createError({ statusCode: 400 })
  }

  // Get new name from query
  const { name } = await readBody(event)
  // Sanitize user input (and set name to username if no new name)
  const newName = (name || username).slice(0, 32).trim()

  user.name = newName
  user.save()

  return null
})
