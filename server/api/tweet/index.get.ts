import { Types } from "mongoose"
import Tweet from "~~/server/models/tweet"
import { checkIsFollowing } from "~~/server/utils/following"
import { checkLikeAndRetweet } from "~~/server/utils/feed"
import { checkId } from "~~/server/utils/query"

interface IUserInfo {
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
  user: IUserInfo
  content?: string
  quote?: Types.ObjectId
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
  isLiked: boolean
  isRetweeted: boolean
}

export default defineEventHandler(async event => {
  const { _id } = getQuery(event)
  if (!checkId(_id)) {
    return createError({ statusCode: 400 })
  }

  const tweet = await Tweet.findOne({ _id }, {
    _id: 0,
    content: 1,
    quote: 1,
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
  }).populate<{ user: IUserInfo }>("user", "username name image bio isPrivate").exec()

  if (!tweet) return createError({ statusCode: 404 })
  if (tweet.isRemoved) return { isUnavailable: true }
  if (tweet.isDeleted) return { isUnavailable: true }

  // Initialize response object
  const response: IResponse = tweet.toObject()
  // Get username
  const username: string | undefined = event.context.user?.username
  // Check if user is getting their own tweets
  const isSelfTweet = username === response.user.username

  // Check if user is following user who tweeted
  response.isFollowing = !isSelfTweet && await checkIsFollowing(username, response.user._id)

  // Protect private tweets
  if (!isSelfTweet && (response.isPrivate || response.user.isPrivate) && !response.isFollowing) {
    return { isUnavailable: true }
  }

  // Check if user liked or retweeted tweet
  const { isLiked, isRetweeted } = await checkLikeAndRetweet(event, _id!.toString())
  response.isLiked = isLiked
  response.isRetweeted = isRetweeted

  delete response.user._id
  if (!response.content) delete response.content
  if (!response.media?.length) delete response.media

  return response
})
