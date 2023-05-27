import Tweet from "@/server/models/tweet"
import { checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"
import { checkDateString } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const { q, before } = getQuery(event)
  if (!q || !checkDateString(before)) {
    return createError({ statusCode: 400 })
  }

  const tweets = await Tweet
    .find({
      $text: { $search: q.toString() },
      retweet: null,
      timestamp: { $lt: before },
      isPrivate: false,
      isDeleted: false,
      isRemoved: false
    },
      null,
      { sort: { timestamp: -1 }},
    )
    .populate("user", "-_id username name image")
    .exec()
    console.log(tweets)

  let next = null
  if (tweets.length === 20) {
    next = getNextUrl(event, {
      before: tweets[tweets.length - 1].timestamp.toISOString()
    })
  }

  return {
    results: await checkLikesAndRetweets(event, tweets),
    next,
  }
})
