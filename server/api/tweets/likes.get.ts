import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkDateString, checkPageNumber, checkUsername } from "~~/server/utils/query"
import { checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"
import Like from "~~/server/models/like"
import { checkIsFollowing } from "~~/server/utils/following"

export default defineEventHandler(async event => {
  const { username, before } = getQuery(event)
  if (!checkUsername(username) || !checkDateString(before)) {
    return createError({ statusCode: 400 })
  }

  const currentUsername = event.context.user?.username
  const currentUser = currentUsername ? await User.findOne(
    { username: currentUsername },
    { _id: 1, following: 1 },
  ).collation(ci).exec() : null
  const currentUserFollowing = new Set(currentUser?.following.map(userId => userId.toString()))

  const user = await User.findOne({ username }, {
    _id: 1,
    following: 1,
    isPrivate: 1,
    isSuspended: 1,
    isDeleted: 1,
  })
    .collation(ci)
    .exec()

  if (!user || user.isSuspended || user.isDeleted) {
    return createError({ statusCode: 400 })
  }

  // Check if current user can see user's likes
  if (user.isPrivate) {
    if (!currentUser) {
      return createError({ statusCode: 403 })
    }
    if (user._id !== currentUser?._id) {
      if (!(await checkIsFollowing(currentUsername, user._id))) {
        return createError({ statusCode: 403 })
      }
    }
  }

  // Get likes
  const likes = await Like.find(
    { user: user._id, timestamp: { $lt: before }},
    { targetTweet: 1, timestamp: 1 },
    { limit: 20, sort: { timestamp: -1 }},
  )
  .populate({
    path: "targetTweet",
    populate: {
      path: "user",
      select: "_id username name image"
    }
  })
  .exec()

  // Get next URL
  let next = null
  if (likes.length === 20) {
    next = getNextUrl(event, {
      before: likes[likes.length - 1].timestamp.toISOString()
    })
  }

  // Convert list of likes to list of tweets
  let tweets: any[] = likes.map(like => like.targetTweet)

  // Filter out certain tweets
  tweets = tweets.filter(tweet => {
    if (tweet.isDeleted || tweet.isRemoved) return false
    if (!tweet.isPrivate) return true
    if (tweet.user.username === currentUsername) return true
    if (tweet.isPrivate) {
      if (!currentUser) return false
      if (!currentUserFollowing.has(tweet.user._id.toString())) return false
    }
    return true
  })

  return {
    results: await checkLikesAndRetweets(event, tweets, { allLiked: true }),
    next,
  }
})
