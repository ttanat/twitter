import Tweet from "@/server/models/tweet"
import User from "@/server/models/user"
import { checkLikesAndRetweets } from "~~/server/utils/likesAndRetweets"
import { getNextUrl } from "~~/server/utils/getNextUrl"

/*
  Routes:
    Home (Index) (Has retweets)
      - Auth => show feed
      - No auth => show explore
    Explore
      - Same for auth and no auth
    Bookmarks
      - Auth only
    User (Has retweets)
      - Same for auth and no auth
      - Profile should have same logic
*/

export default defineEventHandler(async event => {
  const tweets = await Tweet.find()
    .populate("user", "-_id username name image")
    .populate({
      path: "retweet",
      populate: {
        path: "user",
        select: "-_id username name image",
      },
    })
    .exec()

  const results = await checkLikesAndRetweets(event, tweets)

  return {
    results,
    // next: getNextUrl(event),
  }
})
