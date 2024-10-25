import { checkIsFollowingOrRequesting } from "~~/server/utils/following"
import { checkFollowMethod, getUsers, handleDeleteRequest, handleRequest } from "~~/server/utils/follow"

export default defineEventHandler(async event => {
  if (!checkFollowMethod(event)) {
    return createError({ statusCode: 405 })
  }
  const { currentUser, targetUser } = await getUsers(event)
  // Check both users found
  if (!currentUser || !targetUser) {
    return createError({ statusCode: 400 })
  }
  // Check user can be sent follow request
  if (!targetUser.isPrivate || targetUser.isSuspended || targetUser.isDeleted) {
    return createError({ statusCode: 400 })
  }

  // Request or delete request
  let res
  if (getMethod(event) === "POST") {
    // Check follow limit
    if (currentUser.numFollowing >= 5000) {
      return createError({ statusCode: 400, statusMessage: "Can't follow more than 5000 people" })
    }
    // Check if already following or requesting to follow
    const check = await checkIsFollowingOrRequesting(currentUser.username, targetUser._id)
    if (check.isFollowing || check.isRequestingFollow) {
      return createError({ statusCode: 400 })
    }
    // Create request
    res = await handleRequest(currentUser._id, targetUser._id)
  } else if (getMethod(event) === "DELETE") {
    // Delete request
    res = await handleDeleteRequest(currentUser._id, targetUser._id)
  } else {
    return createError({ statusCode: 405 })
  }

  return res.ok ? null : createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
})
