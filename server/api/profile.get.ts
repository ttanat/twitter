import User from "@/server/models/user"
import { Types } from "mongoose"
import { ci } from "~~/server/utils/collations"
import { checkUsername } from "~~/server/utils/query"

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
  const { username } = getQuery(event)
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

  // Check if user is following user
  if (!isSelfProfile && event.context.user) {
    // If profile is private, also check if requesting to follow
    const extraArgs = profile.isPrivate ? { followRequestsSent: { $elemMatch: { $eq: profile._id }}} : {}
    // Check in database
    const tmp = await User.findOne({ username: event.context.user.username }, {
      _id: 0,
      following: { $elemMatch: { $eq: profile._id }},
      ...extraArgs
    })
      .collation(ci)
      .exec()
    // Check current user exists (for type checking)
    if (!tmp) return createError({ statusCode: 404 })
    // Check if user is following user
    profile.isFollowing = tmp.following.length === 1
    // If profile is private, check if user is requesting to follow private user
    if (profile.isPrivate && !profile.isFollowing && tmp.followRequestsSent.length === 1) {
      profile.isRequestingFollow = true
    }
  }

  // Don't send _id back
  delete profile._id
  return profile
})
