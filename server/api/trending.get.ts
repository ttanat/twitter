import Tweet from "~~/server/models/tweet"

export default defineEventHandler(async event => {
  // Get most recent 100 tweets that have at least 1 hashtag
  const tweets = await Tweet.find(
    { "hashtags.0": { $exists: true }, isPrivate: false, isDeleted: false, isRemoved: false },
    { hashtags: 1 },
    { limit: 100, sort: { timestamp: -1 }},
  ).exec()

  // Get occurrences for each hashtag
  const hashtags: Record<string, number> = {}
  tweets.forEach(tweet => {
    tweet.hashtags!.forEach(hashtag => {
      hashtags[hashtag] = (hashtags[hashtag] || 0) + 1
    })
  })

  // Sort occurrences
  const sortable = []
  for (const hashtag in hashtags) {
    sortable.push([hashtag, hashtags[hashtag]])
  }
  sortable.sort(function(a: (any)[], b: (any)[]) {
    return b[1] - a[1]
  })

  // Get 5 most used hashtags
  const trending = []
  for (let i = 0; i < 5; i++) {
    trending.push(sortable[i][0])
  }

  return { trending }
})
