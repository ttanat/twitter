import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkPageNumber, checkUsername } from "~~/server/utils/query"
import { checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"

export default defineEventHandler(async event => {
  const { username } = getQuery(event)
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  // Get page number
  const page = parseInt(getQuery(event).page as string)
  if (!checkPageNumber(page)) {
    return createError({ statusCode: 400 })
  }
  // Get slice for likes array
  const slice = [page * -20, 20]

  const user = await User.findOne({ username }, {
    _id: 1,
    username: 1, // Select random field to prevent mongoose from selecting every field
    likes: { $slice: ["$likes", ...slice] },
    following: 1,
  })
    .collation(ci)
    .exec()

  if (!user) return createError({ statusCode: 400 })

  const tweets = await Tweet
    .find({
      _id: { $in: user.likes },
      // Tweet has to be public or user's own tweet or user has to follow tweeter
      $or: [{ isPrivate: false }, { user: user._id }, { user: { $in: user.following }}],
      isDeleted: false,
      isRemoved: false,
    },
      null, { limit: 20 })
    .populate("user", "-_id username name image")
    .exec()

  let next = null
  if (tweets.length === 20) {
    next = getNextUrl(event, { page: (page + 1).toString() })
  }

  // const tweetsWithIsLiked = event.context.user?.username === username
  //   ? tweets.map(tweet => ({ ...tweet.toObject(), isLiked: true }))
  //   : await checkLikesAndRetweets(event, tweets)

  return {
    results: await checkLikesAndRetweets(event, tweets, true),
    next,
  }
})
