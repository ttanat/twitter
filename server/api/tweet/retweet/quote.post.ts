import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkId, checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const { _id, content } = await readBody(event)
  const username = event.context.user?.username
  if (!checkId(_id) || !checkUsername(username)) {
    return createError({ statusCode: 400 })
  }

  // Slice and trim content
  const parsedContent = String(content).slice(0, 300).trim()
  if (!parsedContent) {
    return createError({ statusCode: 400 })
  }

  // Find user and check if tweet exists
  const [user, tweet] = await Promise.all([
    User.findOne({ username }, { _id: 1 }).collation(ci).exec(),
    Tweet.findOne({ _id }, { _id: 1 }).exec(),
  ])
  if (!user || !tweet) {
    return createError({ statusCode: 404 })
  }

  // Create quote tweet
  const quoteTweet = await Tweet.create({
    user: user._id,
    content: parsedContent,
    quoteTweet: tweet._id,
  })

  return null
})
