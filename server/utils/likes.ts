import Tweet from "~~/server/models/tweet"
import User from "~~/server/models/user"
import { H3Event } from "h3"
import { ci } from "./collations"
import { Types } from "mongoose"

export const checkIsLiked = async (event: H3Event, tweets: any[]): Promise<any[]> => {
  if (!event.context.user?.username || tweets.length === 0) {
    return tweets
  }

  // Get _id's of tweets
  const tweet_ids = tweets.map(tweet => tweet._id)

  // Check if user liked those tweets
  const likeObjs = await User.aggregate([
    // Find user
    { $match: { username: event.context.user.username }},
    // Unwind likes
    { $unwind: { path: "$likes" }},
    // Get only likes field
    { $project: { _id: 0, likes: 1 }},
    // Get likes that are in tweet_ids
    { $match: { likes: { $in: tweet_ids }}}
    // Use collation for finding user
  ], { collation: ci }).exec()

  // Add _id's to set
  const likes = new Set(likeObjs.map(obj => obj.likes.toString()))

  // Add user likes to tweets
  if (likes.size > 0) {
    tweets = tweets.map(tweet => {
      const isLiked = likes.has(tweet._id.toString())
      return { ...tweet.toObject(), isLiked }
    })
  }

  return tweets
}

export const checkTweetIsLiked = async (event: H3Event, _id: Types.ObjectId | string): Promise<boolean> => {
  if (!event.context.user?.username) {
    return false
  }

  const isLiked = (
    await User.findOne({ username: event.context.user.username }, {
      _id: 0, likes: { $elemMatch: { $eq: _id }}
    }).collation(ci).exec()
  )?.likes.length === 1

  return isLiked
}

export const checkTweetsAreRetweeted = async (event: H3Event, tweets: any[]): Promise<any[]> => {
  if (!event.context.user?.username || tweets.length === 0) {
    return tweets
  }
  
  // Get user
  const user = await User.findOne({ username: event.context.user.username }, { _id: 1 }).collation(ci).exec()
  if (!user) {
    return tweets
  }

  // Get _id's of tweets
  const tweet_ids = tweets.map(tweet => tweet._id)

  // Check if user retweeted those tweets
  const retweetObjs = await Tweet.find(
    { user: user._id, retweet: { $in: tweet_ids }},
    { _id: 1 },
    { limit: 20 },
  ).exec()

  // Add _id's to set
  const retweets = new Set(retweetObjs.map(obj => obj._id.toString()))

  // Add user retweets to tweets
  if (retweets.size > 0) {
    tweets = tweets.map(tweet => {
      const isRetweeted = retweets.has(tweet._id.toString())
      return { ...tweet, isRetweeted }
    })
  }

  return tweets
}

export const checkIsRetweeted = async (event: H3Event, _id: Types.ObjectId | string): Promise<boolean> => {
  if (!event.context.user?.username) {
    return false
  }

  // Get user
  const user = await User.findOne(
    { username: event.context.user.username },
    { _id: 1 },
  ).collation(ci).exec()
  if (!user) {
    return false
  }

  // Check if user retweet exists
  const retweet = await Tweet.findOne({ user: user._id, retweet: _id }, { _id: 1 }).exec()

  return !!retweet
}
