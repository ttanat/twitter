import User from "@/server/models/user"
import { ci } from "~~/server/utils/collations"
import { checkUsername } from "~~/server/utils/query"
import { checkFollowingOrRequesting } from "~~/server/utils/checkFollowing"

export default defineEventHandler(async event => {
  const request: boolean = getQuery(event).request === "true"
  // Get usernames
  const currentUser: string = event.context.user.username
  const userToFollow: string = getQuery(event).username?.toString() ?? ""
  // Check valid username and not following self
  if (!checkUsername(currentUser) || !checkUsername(userToFollow) || currentUser.toLowerCase() === userToFollow.toLowerCase()) {
    return createError({ statusCode: 400 })
  }

  // Get both users from database
  const users = await User.find({ username: { $in: [currentUser, userToFollow]} }, {
    _id: 1,
    username: 1,
    numFollowing: 1,
    isPrivate: 1,
    isSuspended: 1,
    isDeactivated: 1,
    isDeleted: 1
  }, { limit: 2 }).collation(ci).exec()

  // Get user objects
  const currentUserObj = users.find(user => user.username === currentUser)
  const userToFollowObj = users.find(user => user.username === userToFollow)
  // Check both users found
  if (!currentUserObj || !userToFollowObj) {
    return createError({ statusCode: 400 })
  }
  // Check user can be sent follow request
  if (!userToFollowObj.isPrivate || userToFollowObj.isSuspended || userToFollowObj.isDeactivated || userToFollowObj.isDeleted) {
    return createError({ statusCode: 400 })
  }

  // Request or delete request
  let res
  if (request) {
    // Check follow limit
    if (currentUserObj.numFollowing >= 5000) {
      return createError({ statusCode: 400, statusMessage: "Can't follow more than 5000 people" })
    }
    // Check if already following or requesting to follow
    const check = await checkFollowingOrRequesting(currentUser, userToFollowObj._id)
    if (check.isFollowing || check.isRequestingFollow) {
      return createError({ statusCode: 400 })
    }
    // Create request
    res = await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: currentUserObj._id },
          update: { $addToSet: { followRequestsSent: userToFollowObj._id }},
        }
      },
      {
        updateOne: {
          filter: { _id: userToFollowObj._id },
          update: { $addToSet: { followRequestsReceived: currentUserObj._id }},
        }
      },
    ])
  } else {
    // Delete request
    res = await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: currentUserObj._id },
          update: { $pull: { followRequestsSent: userToFollowObj._id }},
        }
      },
      {
        updateOne: {
          filter: { _id: userToFollowObj._id },
          update: { $pull: { followRequestsReceived: currentUserObj._id }},
        }
      },
    ])
  }

  return res.modifiedCount === 2 ? null : createError({ statusCode: 400, statusMessage: "Oops, something went wrong." })
})
