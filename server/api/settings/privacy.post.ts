import User, { ci } from "@/server/models/user"
import { checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }

  const user = await User.findOne({ username }, { _id: 1, isPrivate: 1 }).collation(ci).exec()
  if (!user) {
    return createError({ statusCode: 400 })
  }

  const { privacy } = await readBody(event)
  user.isPrivate = privacy
  user.save()

  return null
})
