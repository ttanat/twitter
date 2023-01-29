import User from "@/server/models/user"
import Tweet from "@/server/models/tweet"
import { ci } from "~~/server/utils/collations"
import { checkPageNumber, checkUsername } from "~~/server/utils/query"
import { checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  // Get page number
  const page = parseInt(getQuery(event).page as string)
  if (!checkPageNumber(page)) {
    return createError({ statusCode: 400 })
  }
  // Get slice for bookmarks array
  const slice = [page * -20, 20]

  const user = await User.findOne({ username }, {
    _id: 1,
    username: 1, // Select random field to prevent mongoose from selecting every field
    bookmarks: { $slice: ["$bookmarks", ...slice] },
  })
    .collation(ci)
    .exec()

  if (!user) return createError({ statusCode: 400 })

  const tweets = await Tweet
    .find({ _id: { $in: user.bookmarks }}, {}, { limit: 20 })
    .populate("user", "-_id username name image")
    .exec()

  let next = null
  if (tweets.length === 20) {
    next = getNextUrl(event, { page: (page + 1).toString() })
  }

  return {
    results: await checkLikesAndRetweets(event, tweets),
    next,
  }
})
