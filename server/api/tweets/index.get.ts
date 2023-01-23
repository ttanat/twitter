import Tweet from "@/server/models/tweet"
import User from "@/server/models/user"
import { checkIsLiked } from "~~/server/utils/likes"
import { getNextUrl } from "~~/server/utils/getNextUrl"

/*
  Routes:
    Home (Index)
      - Auth => show feed
      - No auth => show explore
    Explore
      - Same for auth and no auth
    Bookmarks
      - Auth only
    User
      - Same for auth and no auth
      - Profile should have same logic
*/

export default defineEventHandler(async event => {
  const tweets = await Tweet.find().populate("user", "-_id username name image").exec()
  const results = await checkIsLiked(event, tweets)

  return {
    results,
    // next: getNextUrl(event),
  }
})
