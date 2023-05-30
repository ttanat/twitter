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

  let res
  if (isPostMethod) {
    // Prevent bookmarking deleted/removed tweet
    const tweet = await Tweet.findOne({ _id }, { isRemoved: 1, isDeleted: 1 }).exec()
    if (!tweet || tweet.isRemoved || tweet.isDeleted) {
      return createError({ statusCode: 400 })
    }

    /*
      const session = await mongoose.startSession()
      try {
        // Use transaction
        const transactionResults = await session.withTransaction(async () => {
          // Get fields to update
          const userUpdate = isPostMethod ? { $addToSet: { bookmarks: _id }} : { $pull: { bookmarks: _id }}
          // Update user bookmarks array and numBookmarks on tweet
          const [res, res2] = await Promise.all([
            User.updateOne({ username }, userUpdate).collation(ci).exec(),
            Tweet.updateOne({ _id }, { $inc: { numBookmarks: isPostMethod ? 1 : -1 }}).exec(),
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

    // Update user bookmarks array
    res = await User.updateOne({ username }, { $addToSet: { bookmarks: _id }}).collation(ci).exec()
  } else {
    res = await User.updateOne({ username }, { $pull: { bookmarks: _id }}).collation(ci).exec()
  }

  if (res.modifiedCount === 1) {
    // Increment/decrement bookmark count
    await Tweet.updateOne({ _id }, { $inc: { numBookmarks: isPostMethod ? 1 : -1 }}).exec()
    return isPostMethod ? "Bookmarked" : "Unbookmarked"
  } else {
    if (isPostMethod) return "Already bookmarked"
  }

  return createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
})
