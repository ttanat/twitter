import User, { ci } from "~~/server/models/user"
import { Types } from "mongoose"
import { checkUsername } from "~~/server/utils/query"
import { checkIsFollowing, checkIsFollowingOrRequesting } from "~~/server/utils/following"

interface IProfile {
  _id?: Types.ObjectId
  username: string
  name?: string
  image?: string
  banner?: string
  bio?: string
  isVerified?: boolean
  numTweets: number
  dateJoined: Date
  numFollowing: number
  numFollowers: number
  isPrivate: boolean
  isSuspended?: boolean
  isDeactivated?: boolean
  isDeleted?: boolean
  isFollowing?: boolean
  isRequestingFollow?: boolean
}

export default defineEventHandler(async event => {
  const username = getQuery(event).username ?? event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  // Check if user is viewing their own profile
  const isSelfProfile = username === event.context.user?.username

  const profile: IProfile | undefined = (await User.findOne({ username }, {
    _id: 1,
    username: 1,
    name: 1,
    image: 1,
    banner: 1,
    bio: 1,
    isVerified: 1,
    numTweets: 1,
    dateJoined: 1,
    numFollowing: 1,
    numFollowers: 1,
    isPrivate: 1,
    isSuspended: 1,
    isDeactivated: 1,
    isDeleted: 1,
  }).collation(ci).exec())?.toObject()

  if (!profile) return createError({ statusCode: 404, statusMessage: "User not found" })
  if (profile.isSuspended) return { isSuspended: true }
  if (profile.isDeactivated) return { isDeactivated: true }
  if (profile.isDeleted) return { isDeleted: true }

  if (!isSelfProfile && event.context.user) {
    if (profile.isPrivate) {
      // Check if user is following or requesting to follow other user
      const check = await checkIsFollowingOrRequesting(event.context.user.username, profile._id)
      profile.isFollowing = check.isFollowing
      profile.isRequestingFollow = check.isRequestingFollow
    } else {
      // Check if user is following other user
      profile.isFollowing = await checkIsFollowing(event.context.user.username, profile._id)
    }
  }

  delete profile._id
  delete profile.isSuspended
  delete profile.isDeactivated
  delete profile.isDeleted

  return profile
})
