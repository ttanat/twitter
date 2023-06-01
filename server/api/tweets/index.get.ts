import Tweet from "@/server/models/tweet"
import User from "@/server/models/user"
import { ci } from "@/server/models/user"
import { parseRetweets, checkLikesAndRetweets, getNextUrl } from "~~/server/utils/feed"
import { checkDateString, checkUsername } from "~~/server/utils/query"

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
  const username = event.context.user?.username
  const { before } = getQuery(event)
  if (!checkUsername(username) || !checkDateString(before)) {
    return createError({ statusCode: 400 })
  }

  const user = await User.findOne({ username }, { _id: 1, following: 1 }).collation(ci).exec()
  if (!user) {
    return createError({ statusCode: 400 })
  }

  const tweets = await Tweet.find(
    {
      user: { $in: user.following },
      timestamp: { $lt: before },
      isDeleted: false,
      isRemoved: false,
    },
    null,
    { sort: { timestamp: -1 }},
  )
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
  results = await checkLikesAndRetweets(event, results, { userId: user._id })

  return {
    results,
    // next: getNextUrl(event),
  }
})
