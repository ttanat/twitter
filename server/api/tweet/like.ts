import Like from "~~/server/models/like"
import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkId, checkUsername } from "~~/server/utils/query"

const methods = new Set(["POST", "DELETE"])

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  const { _id } = getQuery(event)
  if (!checkId(_id) || !checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  // Check request method
  if (!methods.has(getMethod(event))) {
    return createError({ statusCode: 405 })
  }
  const isPostMethod = getMethod(event) === "POST"

  /*
    const session = await mongoose.startSession()
    try {
      // Use transaction
      const transactionResults = await session.withTransaction(async () => {
        // Get fields to update
        const userUpdate = isPostMethod ? { $addToSet: { likes: _id }} : { $pull: { likes: _id }}
        // Update user likes array and numLikes on tweet
        const [res, res2] = await Promise.all([
          User.updateOne({ username }, userUpdate).collation(ci).exec(),
          Tweet.updateOne({ _id }, { $inc: { numLikes: isPostMethod ? 1 : -1 }}).exec(),
        ])
        // If both not updated, abort transaction
        if (res.modifiedCount !== 1 || res2.modifiedCount !== 1) {
          await session.abortTransaction()
        }
      })
      // Make sure transaction succeeded
      if (!transactionResults) {
        throw new Error()
      }
    } catch (err) {
      return createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
    } finally {
      await session.endSession()
    }
  */

  // Get user who is liking tweet and tweet being liked
  const [user, tweet] = await Promise.all([
    User.findOne({ username }, { _id: 1 }).collation(ci).exec(),
    Tweet.findOne({ _id }, { _id: 1 }).exec(),
  ])
  if (!user || !tweet) {
    return createError({ statusCode: 400 })
  }

  if (isPostMethod) {
    // Create like and increment like count on tweet
    try {
      const [_, res2] = await Promise.all([
        Like.create({ user: user._id, targetTweet: _id }),
        Tweet.updateOne({ _id }, { $inc: { numLikes: 1 }}).exec(),
      ])
      if (res2.modifiedCount === 1) return null
    } catch (err: any) {
      if (err.code === 11000) return createError({ statusCode: 409 })
    }
  } else {
    const [res, res2] = await Promise.all([
      Like.deleteOne({ user: user._id, targetTweet: _id }).exec(),
      Tweet.updateOne({ _id }, { $inc: { numLikes: -1 }}).exec(),
    ])
    if (res.deletedCount === 1 && res2.modifiedCount === 1) return null
  }

  return createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
})
