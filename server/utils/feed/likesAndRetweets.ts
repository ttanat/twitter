import Like from "~~/server/models/like"
import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { H3Event } from "h3"
import { Types } from "mongoose"
import { checkUsername } from "~~/server/utils/query"

type TweetIds = string[] | Types.ObjectId[]
type UserId = Types.ObjectId | string
interface IOptions {
  userId?: UserId | null
  allLiked?: boolean
}

export const checkLikesAndRetweets = async (event: H3Event, tweets: any[], options: IOptions = {}): Promise<any[]> => {
  /*
    Tweets: array of documents or array of objects
    Depends on the route this function is called from

    Returns array of objects
  */

  const username = event.context.user?.username
  if (!checkUsername(username) || tweets.length === 0) {
    return tweets
  }

  // Convert to object first
  // Adding user likes and retweets won't work on documents
  tweets = tweets.map(t => typeof t.toObject === "function" ? t.toObject() : t)

  // Get _id's of tweets
  const tweet_ids = tweets.map(tweet => tweet._id)

  // Get user's _id
  let user_id : UserId | null | undefined = options.userId
  if (!user_id) {
    const user = await User.findOne({ username }, { _id: 1 }).collation(ci).exec()
    if (!user) return tweets
    user_id = user._id
  }

  // Get likes and retweets
  const [likes, retweets] = await Promise.all([
    options.allLiked ? new Set(tweet_ids.map(id => id.toString())) : checkLikes(tweet_ids, user_id),
    checkRetweets(tweet_ids, user_id),
  ])

  // Add user likes and retweets to tweets
  tweets = tweets.map(tweet => {
    // Get _id
    const _id: string = tweet._id.toString()
    // Check if user liked tweet
    const isLiked = likes.has(_id)
    // Check if user retweeted tweet
    const isRetweeted = retweets.has(_id)

    tweet.isLiked = isLiked
    tweet.isRetweeted = isRetweeted

    return tweet
  })

  return tweets
}

/*
  const checkLikes = async (tweet_ids: TweetIds, username: string): Promise<ReadonlySet<string>> => {
    // Check if user liked those tweets
    const likeObjs = await User.aggregate([
      // Find user
      { $match: { username }},
      // Unwind likes
      { $unwind: { path: "$likes" }},
      // Get only likes field
      { $project: { _id: 0, likes: 1 }},
      // Get likes that are in tweet_ids
      { $match: { likes: { $in: tweet_ids }}}
      // Use collation for finding user
    ], { collation: ci }).exec()

    // Flatten array
    const likes = likeObjs.map(obj => obj.likes.toString())

    // Add _id's to set
    return new Set(likes)
  }
*/

const checkLikes = async (tweet_ids: TweetIds, user_id: UserId): Promise<ReadonlySet<string>> => {
  // Check if user liked those tweets
  const likeObjs = await Like.find(
    { user: user_id, targetTweet: { $in: tweet_ids }},
    { targetTweet: 1 },
    { limit: tweet_ids.length },
  ).exec()

  // Flatten array
  const likes = likeObjs.map(obj => obj.targetTweet.toString())

  // Add _id's to set
  return new Set(likes)
}

const checkRetweets = async (tweet_ids: TweetIds, user_id: UserId): Promise<ReadonlySet<string>> => {
  // Check if user retweeted those tweets
  const retweetObjs = await Tweet.find(
    { user: user_id, retweet: { $in: tweet_ids }},
    { _id: 0, retweet: 1 },
    { limit: 20 },
  ).exec()

  // Flatten array
  const retweets = retweetObjs.map(obj => obj.retweet!.toString())

  // Add _id's to set
  return new Set(retweets)
}

type TweetId = string | Types.ObjectId

interface LikeAndRetweet {
  isLiked: boolean
  isRetweeted: boolean
}

export const checkLikeAndRetweet = async (event: H3Event, _id: TweetId): Promise<LikeAndRetweet> => {
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return { isLiked: false, isRetweeted: false }
  }

  const [isLiked, isRetweeted] = await Promise.all([
    checkIsLiked(_id, username),
    checkIsRetweeted(_id, username),
  ])

  return { isLiked, isRetweeted }
}

/*
  const checkIsLiked = async (_id: TweetId, username: string): Promise<boolean> => {
    // If user liked tweet, will get array of length 1, e.g. { likes: [ObjectId("abc")] }
    const userLikes = await User.findOne(
      { username },
      { _id: 0, likes: { $elemMatch: { $eq: _id }},
    }).collation(ci).exec()

    return userLikes?.likes.length === 1
  }
*/

const checkIsLiked = async (_id: TweetId, username: string): Promise<boolean> => {
  const user = await User.findOne({ username }, { _id: 1 }).exec()
  if (!user) return false

  const isLiked = await Like.findOne({ user: user._id, targetTweet: _id }).exec()

  return !!isLiked
}

const checkIsRetweeted = async (_id: TweetId, username: string): Promise<boolean> => {
  // Get user (for _id)
  const user = await User.findOne({ username }, { _id: 1 }).collation(ci).exec()

  // Check if retweet exists
  const retweet = await Tweet.findOne({ user: user!._id, retweet: _id }, { _id: 1 }).exec()

  return !!retweet
}
