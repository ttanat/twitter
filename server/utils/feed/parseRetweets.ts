export const parseRetweets = (tweets: any[]): any[] => {
  /*
    Converts mongoose documents to javascript objects
    Unnests retweet data and add retweetBy field
    Only used in /api/tweets and /api/tweets/user routes
  */

  return tweets.map(tweet => {
    // Convert to javascript object
    const obj = tweet.toObject()

    // Parse retweet
    if (obj.retweet) {
      const tmp = obj.retweet
      tmp.retweetedBy = obj.user.name
      return tmp
    }

    // Return without changing anything if not retweet
    return obj
  })
}
