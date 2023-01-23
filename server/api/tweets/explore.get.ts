import Tweet from "@/server/models/tweet"
import { getNextUrl } from "~~/server/utils/getNextUrl"
import { checkIsLiked } from "~~/server/utils/likes"

export default defineEventHandler(async event => {
  return {
    results: await checkIsLiked(event, await Tweet.find().exec()),
    // next: getNextUrl(event),
  }
})
