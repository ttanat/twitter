import User, { ci } from "~~/server/models/user"
import { checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const { username } = getQuery(event)
  // Check valid characters
  if (!checkUsername(username)) {
    return createError({ statusCode: 400, stack: "" })
  }
  // Check if username exists in database
  const user = await User.findOne({ username }).collation(ci).exec()
  // If user already exists
  if (user) {
    return createError({ statusCode: 409, stack: "" })
  }
  // If user doesn't exist, return 2xx response
  return null
})
