import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkIsFollowing } from "~~/server/utils/following"
import { checkDateString, checkUsername } from "~~/server/utils/query"
import { parseRetweets, checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"

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
    if (!(await checkIsFollowing(event.context.user?.username, user._id))) {
      return createError({ statusCode: 403 })
    }
  }

  const tweets = await Tweet.find({
    user: user._id,
    timestamp: { $lt: before },
    isDeleted: false,
    isRemoved: false,
  }, { /* Select all fields */ }, {
    limit: 20,
    sort: { timestamp: -1 },
  })
    .populate("user", "-_id username name image")
    .populate({
      path: "retweet",
      populate: {
        path: "user",
        select: "-_id username name image",
      },
    })
    .exec()

  let next = null
  if (tweets.length === 20) {
    next = getNextUrl(event, {
      username: username.toString(),
      before: tweets[tweets.length - 1].timestamp.toISOString()
    })
  }

  let results = parseRetweets(tweets)
  results = await checkLikesAndRetweets(event, results)

  return {
    results,
    next,
  }
})
