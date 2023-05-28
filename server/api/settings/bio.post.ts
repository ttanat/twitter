import User, { ci } from "~~/server/models/user"
import { checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }

  const { bio } = await readBody(event)

  const res = await User.updateOne({ username }, { bio }).collation(ci).exec()

  // Use matchedCount instead of modifiedCount because bio could be updated to same value
  return res.matchedCount === 1 ? null : createError({ statusCode: 400 })
})
