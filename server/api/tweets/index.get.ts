import Tweet from "@/server/models/tweet"
import User from "@/server/models/user"
import { parseRetweets, checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"

/*
  Routes:
    Home (Index)
      - Feed has both retweets and quote tweets
      - Auth -> show feed, No auth -> show explore
    Explore
      - No retweets and no quote tweets
      - Same for auth and no auth
    Bookmarks
      - Has quote tweets, no retweets
      - Auth only
    User
      - Has both retweets and quote tweets
      - Same for auth and no auth
      - Also used on profile page (auth only)
    Likes
      - Has quote tweets, no retweets
    Replies
      - No retweets and no quote tweets
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

  let results = parseRetweets(tweets)
  results = await checkLikesAndRetweets(event, results)

  return {
    results,
    // next: getNextUrl(event),
  }
})
