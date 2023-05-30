import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkId, checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const { quote, content } = await readBody(event)
  const username = event.context.user?.username
  if (!checkId(quote) || !checkUsername(username)) {
    return createError({ statusCode: 400 })
  }

  // Slice and trim content
  const parsedContent = String(content).slice(0, 300).trim()
  if (!parsedContent) {
    return createError({ statusCode: 400 })
  }

  // Find user and check if tweet exists
  const [user, tweet] = await Promise.all([
    User.findOne({ username }, { _id: 1, isPrivate: 1, isSuspended: 1, isDeleted: 1 }).collation(ci).exec(),
    Tweet.findOne({ _id: quote }, { _id: 1, isPrivate: 1, isRemoved: 1, isDeleted: 1 }).exec(),
  ])
  if (!user || user.isPrivate || user.isSuspended || user.isDeleted ||
      !tweet || tweet.isPrivate || tweet.isRemoved || tweet.isDeleted) {
    return createError({ statusCode: 400 })
  }

  // Create quote tweet
  await Tweet.create({
    user: user._id,
    content: parsedContent,
    quote: tweet._id,
  })

  // Increment quote count
  await Tweet.updateOne({ _id: tweet._id }, { $inc: { numQuotes: 1 }}).exec()

  return null
})
