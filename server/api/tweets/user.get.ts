import Tweet from "@/server/models/tweet"

export default defineEventHandler(async event => {
  const { username, before } = getQuery(event)
  const tweets = await Tweet.find({
    username,
    timestamp: { $lt: before },
    $limit: 20,
    $sort: { timestamp: -1 }
  })

  let next
  if (tweets.length < 20) {
    next = null
  } else {
    next = event.node.req.url
    const params = new URLSearchParams({
      username: username?.toString()!,
      before: tweets[tweets.length - 1].timestamp.toISOString()
    })
    next = `${event.node.req.url}?${params.toString()}`
  }

  return {
    results: tweets,
    next,
  }
})
