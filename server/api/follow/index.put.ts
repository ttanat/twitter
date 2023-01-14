import User from "@/server/models/user"
import { ci } from "~~/server/utils/collations"
import { handleFollow, handleUnfollow } from "~/server/utils/follow"
import { checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const follow: boolean = getQuery(event).follow === "true"
  // Get usernames
  const currentUser: string = event.context.user?.username
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
  // Check user can be followed
  if (userToFollowObj.isPrivate || userToFollowObj.isSuspended || userToFollowObj.isDeactivated || userToFollowObj.isDeleted) {
    return createError({ statusCode: 400 })
  }

  // Follow or unfollow
  let res
  if (follow) {
    // Check follow limit
    if (currentUserObj.numFollowing >= 5000) {
      return createError({ statusCode: 400, statusMessage: "Can't follow more than 5000 people" })
    }
    res = await handleFollow(currentUserObj._id, userToFollowObj._id)
  } else {
    res = await handleUnfollow(currentUserObj._id, userToFollowObj._id)
  }

  return res.ok ? null : createError({ statusCode: 400, statusMessage: "Oops, something went wrong." })
})
