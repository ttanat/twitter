import User from "@/server/models/user"

export default defineEventHandler(async event => {
  const username = event.context.user?.username
  if (!username) return createError({ statusCode: 401 })

  const profile = await User.findOne({ username }).select({
    _id: 0,
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
    isSuspended: 1,
    isDeactivated: 1,
    isDeleted: 1,
  }).exec()

  if (profile === null) {
    return createError({ statusCode: 404, statusMessage: "User not found" })
  }
  if (profile.isSuspended) {
    return { isSuspended: true }
  }
  if (profile.isDeactivated) {
    return { isDeactivated: true }
  }
  if (profile.isDeleted) {
    return { isDeleted: true }
  }
  return profile
})
