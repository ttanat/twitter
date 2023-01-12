import Tweet from "~~/server/models/tweet"
import User from "~~/server/models/user"
import { ci } from "~~/server/utils/collations"
import { getNextUrl } from "~~/server/utils/getNextUrl"

export default defineEventHandler(async event => {
  const { username, before } = getQuery(event)
  if (!username?.toString().match(/^\w{3,32}$/) || !Date.parse(before?.toString() ?? "")) {
    return createError({ statusCode: 400 })
  }
  // Check if user is getting their own tweets
  const isSelfTweets = username.toString() === event.context.user?.username

  // Get user whose tweets are being viewed
  const user = await User.findOne({ username }, { _id: 1, isPrivate: 1 }).collation(ci).exec()
  if (!user) {
    return createError({ statusCode: 404 })
  }

  // Check if user can view tweets from private account
  if (!isSelfTweets && user.isPrivate) {
    // Current user must be logged in and following private user
    const tmp = event.context.user && await User.findOne(
      { username: event.context.user.username },
      { _id: 0, following: { $elemMatch: { $eq: user._id }}},
    ).collation(ci).exec()
    // Check if user is following private user
    if (tmp?.following.length !== 1) return createError({ statusCode: 403 })
  }

  const tweets = await Tweet.find({
    user: user._id,
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
