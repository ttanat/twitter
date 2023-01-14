import Tweet from "~~/server/models/tweet"
import User from "~~/server/models/user"
import { checkFollowing } from "~~/server/utils/checkFollowing"
import { ci } from "~~/server/utils/collations"
import { getNextUrl } from "~~/server/utils/getNextUrl"
import { checkDateString, checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const username = getQuery(event).username ?? event.context.user?.username
  const { before } = getQuery(event)
  if (!checkUsername(username) || !checkDateString(before)) {
    return createError({ statusCode: 400 })
  }
  // Check if user is getting their own tweets
  const isSelfTweets = username === event.context.user?.username

  // Get user whose tweets are being viewed
  const user = await User.findOne({ username }, { _id: 1, isPrivate: 1 }).collation(ci).exec()
  if (!user) {
    return createError({ statusCode: 404 })
  }

  // Check if user can view tweets from private account
  if (!isSelfTweets && user.isPrivate) {
    if (!(await checkFollowing(event.context.user?.username, user._id))) {
      return createError({ statusCode: 403 })
    }
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
