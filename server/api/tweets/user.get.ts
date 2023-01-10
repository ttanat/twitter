import Tweet from "@/server/models/tweet"
import { getNextUrl } from "~~/server/utils/getNextUrl"

export default defineEventHandler(async event => {
  let { username, before } = getQuery(event)
  // Get user's own tweets (API called from /profile)
  username ||= event.context.user?.username
  if (!username) {
    return createError({ statusCode: 401 })
  }

  const tweets = await Tweet.find({
    username,
    timestamp: { $lt: before },
    $limit: 25,
    $sort: { timestamp: -1 }
  })

  let next = null
  if (tweets.length > 25) {
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
