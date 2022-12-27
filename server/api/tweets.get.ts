import Tweet from "@/server/models/tweet"

export default defineEventHandler(event => {
  return Tweet.find()
})
