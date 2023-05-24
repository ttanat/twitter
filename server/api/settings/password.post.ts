import bcrypt from "bcrypt"
import User, { ci } from "~~/server/models/user"
import { checkUsername } from "~~/server/utils/query"

const saltRounds = 10

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }

  // Get user from database
  const user = await User.findOne({ username }, {
    _id: 1,
    password: 1,
  }).collation(ci).exec()
  // Check if user exists
  if (!user) {
    return createError({ statusCode: 400 })
  }

  // Get old and new password from request body
  const { oldPassword, newPassword } = await readBody(event)
  // Check old password is correct
  if (!oldPassword || !await bcrypt.compare(oldPassword, user.password)) {
    return createError({ statusCode: 401 })
  }

  // Hash and set new password
  user.password = await bcrypt.hash(newPassword, saltRounds)
  user.save()

  return null
})
