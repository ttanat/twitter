import User from "~~/server/models/user"
import { checkFollowMethod, getUsers, handleDeleteRequest, handleFollow } from "~~/server/utils/follow"

export default defineEventHandler(async event => {
  if (!checkFollowMethod(event)) {
    return createError({ statusCode: 405 })
  }
  const { currentUser, targetUser } = await getUsers(event)
  if (!currentUser || !targetUser) {
    return createError({ statusCode: 400 })
  }

  let res = { ok: true }
  if (getMethod(event) === "POST") {
    // Check follow limit
    if (targetUser.numFollowing < 5000) {
      // Follow
      res = await handleFollow(targetUser._id, currentUser._id)
    }
  }

  // Delete follow request (even if follow didn't happen ^)
  // const res2 = await User.bulkWrite([
  //   {
  //     updateOne: {
  //       filter: { _id: currentUser._id },
  //       update: { $pull: { followRequestsReceived: targetUser._id }},
  //     }
  //   },
  //   {
  //     updateOne: {
  //       filter: { _id: targetUser._id },
  //       update: { $pull: { followRequestsSent: currentUser._id }},
  //     }
  //   },
  // ])
  // Swap currentUser and userToDeleteRequest around
  const res2 = await handleDeleteRequest(targetUser._id, currentUser._id)

  // return res.ok && res2.modifiedCount === 2 ? null : createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
  return res.ok && res2.ok ? null : createError({ statusCode: 500, statusMessage: "Oops, something went wrong." })
})
