import { checkFollowMethod, getUsers, handleFollow, handleUnfollow } from "~/server/utils/follow"

export default defineEventHandler(async event => {
  if (!checkFollowMethod(event)) {
    return createError({ statusCode: 405 })
  }
  const { currentUser, targetUser } = await getUsers(event)
  // Check both users found
  if (!currentUser || !targetUser) {
    return createError({ statusCode: 400 })
  }
  // Check user account is available to follow
  if (targetUser.isSuspended || targetUser.isDeleted) {
    return createError({ statusCode: 400 })
  }

  // Follow or unfollow
  let res
  if (getMethod(event) === "POST") {
    // Cannot directly follow private account (need to request to follow)
    if (targetUser.isPrivate) {
      return createError({ statusCode: 400 })
    }
    // Check follow limit
    if (currentUser.numFollowing >= 5000) {
      return createError({ statusCode: 400, statusMessage: "Can't follow more than 5000 people" })
    }
    res = await handleFollow(currentUser._id, targetUser._id)
  } else if (getMethod(event) === "DELETE") {
    res = await handleUnfollow(currentUser._id, targetUser._id)
  } else {
    return createError({ statusCode: 405 })
  }

  return res.ok ? null : createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
})
