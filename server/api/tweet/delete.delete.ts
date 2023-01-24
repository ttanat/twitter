import Tweet from "~~/server/models/tweet"
import { checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  const { _id } = getQuery(event)
  if (!_id) {
    return createError({ statusCode: 400 })
  }

  const tweet = await Tweet.findOne({ _id }, { _id: 0, isRemoved: 1, isDeleted: 1 })
    .populate<{ user: { username: string }}>("user", "-_id username")
    .exec()

  if (!tweet || tweet.isRemoved || tweet.isDeleted || username !== tweet.user.username) {
    return createError({ statusCode: 400 })
  }

  await Tweet.updateOne({ _id }, { isDeleted: true }).exec()

  return null
})
