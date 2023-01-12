import Tweet from "~~/server/models/tweet"
import User from "~~/server/models/user"
import { ci } from "~~/server/utils/collations"
import { getNextUrl } from "~~/server/utils/getNextUrl"

export default defineEventHandler(async event => {
  const { username, before } = getQuery(event)
  if (!username) {
    return createError({ statusCode: 401 })
  }
  if (!before) {
    return createError({ statusCode: 400 })
  }
  // Check if user is getting their own tweets
  const isSelfTweets = username === event.context.user?.username

  // Get user whose tweets are being viewed
  const user = await User.findOne({ username }, { _id: 1 }).collation(ci).exec()
  if (!user) {
    return createError({ statusCode: 404 })
  }

  const extraArgs: { isPrivate?: boolean } = {}

  // Check if user can view private tweets
  if (!isSelfTweets) {
    let tmp
    if (event.context.user) {
      // Check current user is following user
      tmp = await User.findOne(
        { username: event.context.user.username },
        { _id: 0, following: { $elemMatch: { $eq: user._id }}},
      ).collation(ci).exec()
    }
    // If not following, then user cannot see private tweets
    if (!tmp?.following) {
      extraArgs.isPrivate = false
    }
  }

  const tweets = await Tweet.find({
    user: user._id,
    ...extraArgs,
    timestamp: { $lt: before },
    $limit: 20,
    $sort: { timestamp: -1 },
  })
    .populate("user", "username name image")
    .collation(ci)
    .exec()

  let next = null
  if (tweets.length > 20) {
    next = getNextUrl(event, {
      username: username?.toString()!,
      before: tweets[tweets.length - 1].timestamp.toISOString()
    })
  }

  return {
    results: tweets,
    next,
  }
})
