import { checkFollowingOrRequesting } from "~~/server/utils/checkFollowing"
import { getUsers, handleDeleteRequest, handleRequest } from "~~/server/utils/follow"

export default defineEventHandler(async event => {
  const request: boolean = getQuery(event).request === "true"
  const { currentUser, userToFollow } = await getUsers(event)
  // Check both users found
  if (!currentUser || !userToFollow) {
    return createError({ statusCode: 400 })
  }
  // Check user can be sent follow request
  if (!userToFollow.isPrivate || userToFollow.isSuspended || userToFollow.isDeactivated || userToFollow.isDeleted) {
    return createError({ statusCode: 400 })
  }

  // Request or delete request
  let res
  if (request) {
    // Check follow limit
    if (currentUser.numFollowing >= 5000) {
      return createError({ statusCode: 400, statusMessage: "Can't follow more than 5000 people" })
    }
    // Check if already following or requesting to follow
    const check = await checkFollowingOrRequesting(currentUser.username, userToFollow._id)
    if (check.isFollowing || check.isRequestingFollow) {
      return createError({ statusCode: 400 })
    }
    // Create request
    res = await handleRequest(currentUser._id, userToFollow._id)
  } else {
    // Delete request
    res = await handleDeleteRequest(currentUser._id, userToFollow._id)
  }

  return res.ok ? null : createError({ statusCode: 400, statusMessage: "Oops, something went wrong." })
})
