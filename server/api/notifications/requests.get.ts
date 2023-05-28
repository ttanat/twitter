import User from "~~/server/models/user"
import { ci } from "~~/server/models/user"
import { checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }

  const user = await User
    .findOne({ username }, { _id: 0, followRequestsReceived: { $slice: 100 }})
    .collation(ci)
    .exec()
  if (!user) {
    return createError({ statusCode: 400 })
  }

  const usersRequesting = await User.find(
    { _id: { $in: user.followRequestsReceived }},
    { _id: 0, username: 1, name: 1, image: 1 },
    { limit: 100 },
  ).exec()

  return { requests: usersRequesting }
})
