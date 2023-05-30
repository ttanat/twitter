import Tweet from "~~/server/models/tweet"
import { checkDateString, checkId } from "~~/server/utils/query"
import { checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"
import User, { ci } from "~~/server/models/user"

export default defineEventHandler(async event => {
  const { _id, before } = getQuery(event)
  if (!checkId(_id) || !checkDateString(before)) {
    return createError({ statusCode: 400 })
  }

  // Get parent tweet
  const parent = await Tweet
    .findOne({ _id }, { _id: 1, isPrivate: 1, isRemoved: 1, isDeleted: 1 })
    .populate("user", "_id isPrivate")
    .exec()

  if (!parent || parent.isRemoved || parent.isDeleted) {
    return createError({ statusCode: 400 })
  }

  // Get current user
  const username = event.context.user?.username
  const user = username ? await User.findOne({ username }, { following: 1 }).collation(ci).exec() : null

  if (parent.isPrivate) {
    if (!user) {
      return createError({ statusCode: 403 })
    }
    // Check if user can view parent tweet (and therefore replies)
    if (!user.following.includes(parent.user._id)) {
      return createError({ statusCode: 403 })
    }
  }

  // If signed in, tweet has to be public or user's own tweet or user has to follow tweeter
  // If not, then only allowed if reply is public
  const query = user ? { $or : [{ isPrivate: false }, { user: user._id }, { user: { $in: user.following }}]}
                       : { isPrivate: false }

  const replies = await Tweet
    .find({
      parent: _id,
      // retweet: null,
      timestamp: { $lt: before },
      ...query,
      isDeleted: false,
      isRemoved: false,
    }, null, { limit: 20, sort: { timestamp: -1 } })
    .populate("user", "-_id username name image")
    .exec()

  let next = null
  if (replies.length === 20) {
    next = getNextUrl(event, {
      _id: _id!.toString(),
      before: replies[replies.length - 1].timestamp.toISOString()
    })
  }

  return {
    results: await checkLikesAndRetweets(event, replies),
    next,
  }
})
