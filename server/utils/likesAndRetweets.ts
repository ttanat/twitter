import Tweet from "~~/server/models/tweet"
import User from "~~/server/models/user"
import { H3Event } from "h3"
import { ci } from "./collations"
import { Types } from "mongoose"
import { checkUsername } from "./query"

type TweetIds = string[] | Types.ObjectId[]

export const checkLikesAndRetweets = async (event: H3Event, tweets: any[]): Promise<any[]> => {
  const username = event.context.user?.username
  if (!checkUsername(username) || tweets.length === 0) {
    return tweets
  }

  // Get _id's of tweets
  const tweet_ids = tweets.map(tweet => tweet._id)

  // Get likes and retweets
  const [likes, retweets] = await Promise.all([
    checkLikes(tweet_ids, username),
    checkRetweets(tweet_ids, username),
  ])
  console.log(retweets)

  // Add user likes and retweets to tweets
  tweets = tweets.map(tweet => {
    const _id = tweet._id.toString()
    // Check if user liked tweet
    const isLiked = likes.has(_id)
    // Check if user retweeted tweet
    const isRetweeted = retweets.has(_id)
    if (isRetweeted) console.log(isRetweeted)
    
    return { ...tweet.toObject(), isLiked, isRetweeted }
  })

  return tweets
}

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

const checkRetweets = async (tweet_ids: TweetIds, username: string): Promise<ReadonlySet<string>> => {
  // Get user
  const user = await User.findOne({ username }, { _id: 1 }).collation(ci).exec()
  if (!user) {
    return new Set()
  }

  // Check if user retweeted those tweets
  const retweetObjs = await Tweet.find(
    { user: user._id, retweet: { $in: tweet_ids }},
    { _id: 1 },
    { limit: 20 },
  ).exec()

  // Flatten array
  const retweets = retweetObjs.map(obj => obj._id.toString())

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

const checkIsLiked = async (_id: TweetId, username: string): Promise<boolean> => {
  // If user liked tweet, will get array of length 1, e.g. { likes: [ObjectId("abc")] }
  const userLikes = await User.findOne(
    { username },
    { _id: 0, likes: { $elemMatch: { $eq: _id }},
  }).collation(ci).exec()

  return userLikes?.likes.length === 1
}

const checkIsRetweeted = async (_id: TweetId, username: string): Promise<boolean> => {
  // Get user (for _id)
  const user = await User.findOne({ username }, { _id: 1 }).collation(ci).exec()

  // Check if retweet exists
  const retweet = await Tweet.findOne({ user: user!._id, retweet: _id }, { _id: 1 }).exec()

  return !!retweet
}
