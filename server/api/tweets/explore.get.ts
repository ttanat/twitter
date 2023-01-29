import Tweet from "@/server/models/tweet"
import { checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"

export default defineEventHandler(async event => {
  return {
    results: await checkLikesAndRetweets(event, await Tweet.find().exec()),
    // next: getNextUrl(event),
  }
})
