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

  // const session = await mongoose.startSession()
  // try {
  //   // Use transaction
  //   const transactionResults = await session.withTransaction(async () => {
  //     // Get fields to update
  //     const userUpdate = isPostMethod ? { $addToSet: { bookmarks: _id }} : { $pull: { bookmarks: _id }}
  //     // Update user bookmarks array and numBookmarks on tweet
  //     const [res, res2] = await Promise.all([
  //       User.updateOne({ username }, userUpdate).collation(ci).exec(),
  //       Tweet.updateOne({ _id }, { $inc: { numBookmarks: isPostMethod ? 1 : -1 }}).exec(),
  //     ])
  //     // If both not updated, abort transaction
  //     if (res.modifiedCount !== 1 || res2.modifiedCount !== 1) {
  //       await session.abortTransaction()
  //     }
  //   })
  //   // Make sure transaction succeeded
  //   if (!transactionResults) {
  //     throw new Error()
  //   }
  // } catch (err) {
  //   return createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
  // } finally {
  //   await session.endSession()
  // }

  // Get fields to update
  const userUpdate = isPostMethod ? { $addToSet: { bookmarks: _id }} : { $pull: { bookmarks: _id }}
  // Update user bookmarks array and numBookmarks on tweet
  const [res, res2] = await Promise.all([
    User.updateOne({ username }, userUpdate).collation(ci).exec(),
    Tweet.updateOne({ _id }, { $inc: { numBookmarks: isPostMethod ? 1 : -1 }}).exec(),
  ])
  // If both not updated, abort transaction
  if (res.modifiedCount !== 1 || res2.modifiedCount !== 1) {
    return createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
  }

  return null
})
