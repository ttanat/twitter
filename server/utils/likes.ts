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
    }).exec()
  )?.likes.length === 1

  return isLiked
}
