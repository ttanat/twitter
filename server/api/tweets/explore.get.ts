import Tweet from "@/server/models/tweet"
import { getNextUrl } from "~~/server/utils/getNextUrl"
import { checkLikesAndRetweets } from "~~/server/utils/likesAndRetweets"

export default defineEventHandler(async event => {
  return {
    results: await checkLikesAndRetweets(event, await Tweet.find().exec()),
    // next: getNextUrl(event),
  }
})
