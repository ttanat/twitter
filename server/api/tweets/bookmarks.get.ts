import Bookmark from "~~/server/models/bookmark"
import User, { ci } from "~~/server/models/user"
import { checkDateString, checkUsername } from "~~/server/utils/query"
import { checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  const { before } = getQuery(event)
  if (!checkUsername(username) || !checkDateString(before)) {
    return createError({ statusCode: 400 })
  }

  const user = await User.findOne({ username }, { _id: 1, following: 1 }).collation(ci).exec()
  if (!user) {
    return createError({ statusCode: 400 })
  }
  const userFollowing = new Set(user.following.map(userId => userId.toString()))

  // Get bookmarks
  const bookmarks = await Bookmark.find(
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
  if (bookmarks.length === 20) {
    next = getNextUrl(event, {
      before: bookmarks[bookmarks.length - 1].timestamp.toISOString()
    })
  }

  // Convert list of bookmarks to list of tweets
  let tweets: any[] = bookmarks.map(bookmark => bookmark.targetTweet)

  // Filter out certain tweets
  tweets = tweets.filter(tweet => {
    if (tweet.isDeleted || tweet.isRemoved) return false
    if (!tweet.isPrivate) return true
    if (tweet.user.username === username) return true
    if (tweet.isPrivate) {
      if (!user) return false
      if (!userFollowing.has(tweet.user._id.toString())) return false
    }
    return true
  })

  return {
    results: await checkLikesAndRetweets(event, tweets),
    next,
  }
})
