import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkId, checkUsername } from "~~/server/utils/query"

const allowedMethods = new Set(["POST", "DELETE"])

export default defineEventHandler(async event => {
  const { _id } = getQuery(event)
  const username = event.context.user?.username
  if (!checkId(_id) || !checkUsername(username)) {
    return createError({ statusCode: 400 })
  }

  const method = getMethod(event)
  if (!allowedMethods.has(method)) {
    return createError({ statusCode: 405 })
  }

  if (method === "POST") {
    // Find user and check if tweet exists
    const [user, tweet] = await Promise.all([
      User.findOne({ username }, { _id: 1, isPrivate: 1 }).collation(ci).exec(),
      Tweet.findOne({ _id }, { _id: 1, isPrivate: 1 }).exec(),
    ])
    if (!user || !tweet || user.isPrivate || tweet.isPrivate) {
      return createError({ statusCode: 400 })
    }

    // Create retweet
    const retweet = await Tweet.create({
      user: user._id,
      retweet: tweet._id,
    })
  } else {
    // Find user
    const user = await User.findOne({ username }, { _id: 1 }).collation(ci).exec()
    if (!user) {
      return createError({ statusCode: 400 })
    }
    // Delete retweet
    const res = await Tweet.deleteOne({ user: user._id, retweet: _id }).exec()
    if (res.deletedCount !== 1) {
      if (res.deletedCount < 1) {
        return createError({ statusCode: 404 })
      }
      return createError({ statusCode: 500 })
    }
  }

  // Increment/decrement retweet count
  const res2 = await Tweet.updateOne({ _id }, { $inc: { numRetweets: method === "POST" ? 1 : -1 }}).exec()
  if (res2.modifiedCount !== 1) {
    return createError({ statusCode: 500 })
  }

  return null
})
