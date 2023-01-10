import User from "@/server/models/user"

export default defineEventHandler(async event => {
  let { username } = getQuery(event)
  // Check if user is viewing their own profile
  const isSelfProfile = !!username
  username ||= event.context.user?.username
  if (!username) {
    return createError({ statusCode: 401 })
  }

  const profile = await User.findOne({ username }).select({
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

  // Check if user is following user
  if (!isSelfProfile && event.context.user) {
    const isFollowing = !!(await User.countDocuments({
      username: event.context.user.username,
      following: profile._id,
    }, { limit: 1 }).exec())

    return { ...profile.toObject(), isFollowing }
  }

  return profile
})
