import { getUsers, handleFollow, handleUnfollow } from "~/server/utils/follow"

export default defineEventHandler(async event => {
  const follow: boolean = getQuery(event).follow === "true"
  const { currentUser, userToFollow } = await getUsers(event)
  // Check both users found
  if (!currentUser || !userToFollow) {
    return createError({ statusCode: 400 })
  }
  // Check user can be followed
  if (userToFollow.isPrivate || userToFollow.isSuspended || userToFollow.isDeactivated || userToFollow.isDeleted) {
    return createError({ statusCode: 400 })
  }

  // Follow or unfollow
  let res
  if (follow) {
    // Check follow limit
    if (currentUser.numFollowing >= 5000) {
      return createError({ statusCode: 400, statusMessage: "Can't follow more than 5000 people" })
    }
    res = await handleFollow(currentUser._id, userToFollow._id)
  } else {
    res = await handleUnfollow(currentUser._id, userToFollow._id)
  }

  return res.ok ? null : createError({ statusCode: 400, statusMessage: "Oops, something went wrong." })
})
