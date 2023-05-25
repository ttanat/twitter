import Tweet from "@/server/models/tweet"
import { checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"

export default defineEventHandler(async event => {
  const tweets = await Tweet
    .find({ retweet: null, isPrivate: false, isDeleted: false, isRemoved: false },
      {},
      { sort: { numRetweets: -1, numLikes: -1, timestamp: -1 }},
    )
    .populate("user", "-_id username name image")
    .exec()

  return {
    results: await checkLikesAndRetweets(event, tweets),
    // next: getNextUrl(event),
  }
})
