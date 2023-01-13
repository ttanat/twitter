import { Types } from "mongoose"
import Tweet from "~~/server/models/tweet"
import User from "~~/server/models/user"
import { ci } from "~~/server/utils/collations"

interface UserInfo {
  _id?: Types.ObjectId
  username: string
  name?: string
  image?: string
  bio?: string
  isPrivate?: boolean
  isFollowing?: boolean
}

interface IResponse {
  _id?: Types.ObjectId
  user: UserInfo
  content?: string
  quotedTweet?: Types.ObjectId
  timestamp?: Date
  media?: string[]
  poll?: object
  numReplies?: number
  numRetweets?: number
  numQuotes?: number
  numLikes?: number
  isPrivate?: boolean
  isRemoved?: boolean
  isDeleted?: boolean
  isFollowing?: boolean
}

export default defineEventHandler(async event => {
  const { _id } = getQuery(event)
  if (!_id) {
    return createError({ statusCode: 400 })
  }

  const tweet = await Tweet.findOne({ _id }, {
    _id: 1,
    content: 1,
    quotedTweet: 1,
    timestamp: 1,
    media: 1,
    poll: 1,
    numReplies: 1,
    numRetweets: 1,
    numQuotes: 1,
    numLikes: 1,
    isPrivate: 1,
    isRemoved: 1,
    isDeleted: 1,
  }).populate<{ user: UserInfo }>("user", "username name image bio isPrivate").exec()

  if (!tweet) return createError({ statusCode: 404 })
  if (tweet.isRemoved) return { isRemoved: true }
  if (tweet.isDeleted) return { isDeleted: true }

  // Initialize response object
  const response: IResponse = tweet.toObject()
  // Get username
  const username: string | undefined = event.context.user?.username
  // Check if user is getting their own tweets
  const isSelfTweet = username === response.user.username

  // Check if user is following user who tweeted
  const tmp = username ? await User.findOne(
    { username },
    { _id: 0, following: { $elemMatch: { $eq: response.user._id }}},
  ).collation(ci).exec() : null

  // Add to response if following
  if (tmp) response.isFollowing = tmp?.following.length === 1

  // Protect private tweets
  if (!isSelfTweet && (response.isPrivate || response.user.isPrivate) && !response.isFollowing) {
    return createError({ statusCode: 403 })
  }

  delete response._id
  delete response.user._id
  if (!response.content) delete response.content
  if (!response.media?.length) delete response.media

  return response
})
