import Tweet from "@/server/models/tweet"
import { getNextUrl } from "~~/server/utils/getNextUrl"

export default defineEventHandler(async event => {
  return {
    results: await Tweet.find().exec(),
    // next: getNextUrl(event),
  }
})
