import { Types } from "mongoose"
import Tweet from "~~/server/models/tweet"
import { checkIsFollowing } from "~~/server/utils/following"
import { checkId } from "~~/server/utils/query"

interface IUserInfo {
  _id?: Types.ObjectId
  username: string
  name: string
  image?: string
  isPrivate?: boolean
  isFollowing?: boolean
}

interface IResponse {
  _id?: Types.ObjectId
  user: IUserInfo
  content?: string
  timestamp?: Date
  media?: string[]
  poll?: object
  isPrivate?: boolean
  isRemoved?: boolean
  isDeleted?: boolean
  isFollowing?: boolean
}

export default defineEventHandler(async event => {
  const { _id } = getQuery(event)
  if (!checkId(_id)) {
    return createError({ statusCode: 400 })
  }

  const tweet = await Tweet.findOne({ _id }, {
    _id: 0,
    content: 1,
    timestamp: 1,
    media: 1,
    poll: 1,
    isPrivate: 1,
    isRemoved: 1,
    isDeleted: 1,
  }).populate<{ user: IUserInfo }>("user", "username name image isPrivate").exec()

  if (!tweet) return createError({ statusCode: 404 })
  if (tweet.isRemoved) return { isRemoved: true }
  if (tweet.isDeleted) return { isDeleted: true }

  // Initialize response object
  const response: IResponse = tweet.toObject()
  // Get username
  const username: string | undefined = event.context.user?.username
  // Check if user is getting their own tweets
  const isSelfTweet = username === response.user.username

  
  // Protect private tweets
  if (!isSelfTweet && (response.isPrivate || response.user.isPrivate)) {
    // Check if user is following user who tweeted
    const isFollowing = await checkIsFollowing(username, response.user._id)
    if (!isFollowing) {
      return createError({ statusCode: 403, statusMessage: "Tweet is private" })
    }
  }

  delete response.user._id
  if (!response.content) delete response.content
  if (!response.media?.length) delete response.media

  return response
})
