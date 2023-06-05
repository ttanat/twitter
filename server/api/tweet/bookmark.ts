import Bookmark from "~~/server/models/bookmark"
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

  // Get user who is liking tweet and tweet being bookmarked
  const [user, tweet] = await Promise.all([
    User.findOne({ username }, { _id: 1, isSuspended: 1, isDeleted: 1 }).collation(ci).exec(),
    Tweet.findOne({ _id }, { _id: 1, isRemoved: 1, isDeleted: 1 }).exec(),
  ])
  if (!user || user.isSuspended || user.isDeleted ||
      !tweet || tweet.isRemoved || tweet.isDeleted) {
    return createError({ statusCode: 400 })
  }

  if (isPostMethod) {
    // Create bookmark and increment bookmark count on tweet
    try {
      const [_, res2] = await Promise.all([
        Bookmark.create({ user: user._id, targetTweet: _id }),
        Tweet.updateOne({ _id }, { $inc: { numBookmarks: 1 }}).exec(),
      ])
      if (res2.modifiedCount === 1) return "Bookmarked"
    } catch (err: any) {
      if (err.code === 11000) return "Already bookmarked"
    }
  } else {
    const [res, res2] = await Promise.all([
      Bookmark.deleteOne({ user: user._id, targetTweet: _id }).exec(),
      Tweet.updateOne({ _id }, { $inc: { numBookmarks: -1 }}).exec(),
    ])
    if (res.deletedCount === 1 && res2.modifiedCount === 1) return "Unbookmarked"
  }

  return createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
})
