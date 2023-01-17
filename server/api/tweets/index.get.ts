import Tweet from "@/server/models/tweet"
import User from "@/server/models/user"
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
  return {
    results: await Tweet.find().populate("user", "-_id username name image").exec(),
    // next: getNextUrl(event),
  }
})
