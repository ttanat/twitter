import User, { ci } from "~~/server/models/user"
import { checkUsername } from "~~/server/utils/query"
import { Types } from "mongoose"
import { H3Event } from "h3"

const allowedHttpMethods = new Set(["POST", "DELETE"])

export const checkFollowMethod = (event: H3Event): boolean => {
  return allowedHttpMethods.has(getMethod(event))
}

type FollowUser = {
  _id: Types.ObjectId
  username: string
  numFollowing: number
  isPrivate: boolean
  isSuspended: boolean
  isDeleted: boolean
} | undefined

export const getUsers = async (event: H3Event): Promise<{ currentUser?: FollowUser; targetUser?: FollowUser }> => {
  // Get usernames
  const currentUserUsername: string = event.context.user?.username
  const targetUserUsername: string = getQuery(event).username?.toString() ?? ""
  // Check valid username and not following self
  if (!checkUsername(currentUserUsername) || !checkUsername(targetUserUsername) || currentUserUsername.toLowerCase() === targetUserUsername.toLowerCase()) {
    return {}
  }

  // Get both users from database
  const users = await User.find({ username: { $in: [currentUserUsername, targetUserUsername]} }, {
    _id: 1,
    username: 1,
    numFollowing: 1,
    isPrivate: 1,
    isSuspended: 1,
    isDeleted: 1
  }, { limit: 2 }).collation(ci).exec()

  // Get user objects
  const currentUser: FollowUser = users.find(user => user.username === currentUserUsername)?.toObject()
  const targetUser: FollowUser = users.find(user => user.username === targetUserUsername)?.toObject()

  if (currentUser?.isSuspended || currentUser?.isDeleted ||
      targetUser?.isSuspended || targetUser?.isDeleted) {
    return {}
  }

  return { currentUser, targetUser }
}

export const handleFollow = async (currentUserId: Types.ObjectId, userToFollowId: Types.ObjectId): Promise<{ ok: boolean }> => {
  // Check not following self
  if (currentUserId === userToFollowId) {
    return { ok: false }
  }

  // console.log('start')
  // const session = await mongoose.startSession()
  // try {
  //   // Use transaction
  //   /* session.startTransaction() */
  //   const transactionResults = await session.withTransaction(async () => {
  //     console.log('-----')
  //     // Update user likes array and numLikes on tweet
  //     const [res, res2, res3] = await Promise.all([
  //       User.updateOne({ _id: currentUserId }, { $addToSet: { following: userToFollowId }}, { session }).exec(),
  //       User.updateOne({ _id: currentUserId }, { $inc: { numFollowing: 1 }}, { session }).exec(),
  //       User.updateOne({ _id: userToFollowId }, {
  //         $push: { followers: { $each: [currentUserId], $slice: 5000 }},
  //         $inc: { numFollowers: 1 },
  //       }, { session }).exec(),
  //     ])
  //     console.log(res.modifiedCount, res2.modifiedCount, res3.modifiedCount)
  //     // If all not updated, abort transaction
  //     if (res.modifiedCount !== 1 || res2.modifiedCount !== 1 || res3.modifiedCount !== 1) {
  //       console.log('abort')
  //       await session.abortTransaction()
  //       /* return */
  //     }/* else {
  //       console.log('commit')
  //       await session.commitTransaction()
  //     }*/
  //   })
  //   /*console.log(transactionResults)
  //   // Make sure transaction succeeded
  //   if (!transactionResults) {
  //     // throw new Error()
  //   }*/
  // } catch (err) {
  //   console.log(err)
  //   return { ok: false }
  // } finally {
  //   await session.endSession()
  // }
  // console.log('end')
  // return { ok: true }

  // Add userToFollow to currentUser's following list
  const res = await User.updateOne({ _id: currentUserId }, { $addToSet: { following: userToFollowId }}).exec()
  // Proceed if document was modified (no duplicates detected from $addToSet)
  if (res.modifiedCount === 1) {
    await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: currentUserId },
          update: { $inc: { numFollowing: 1 }},
        }
      },
      // Add currentUser to userToFollow's followers list (limit 5000)
      {
        updateOne: {
          filter: { _id: userToFollowId },
          update: {
            $push: { followers: { $each: [currentUserId], $slice: 5000 }},
            $inc: { numFollowers: 1 },
          },
        }
      },
    ])
    return { ok: true }
  } else {
    return { ok: false }
  }
}

// Mostly same logic but pull and decrement
export const handleUnfollow = async (currentUserId: Types.ObjectId, userToUnfollowId: Types.ObjectId): Promise<{ ok: boolean }> => {
  // Check not unfollowing self
  if (currentUserId === userToUnfollowId) {
    return { ok: false }
  }
  // Remove userToUnfollow from currentUser's following list
  const res = await User.updateOne({ _id: currentUserId }, { $pull: { following: userToUnfollowId }}).exec()
  // Proceed if document was modified (user was removed)
  if (res.modifiedCount === 1) {
    await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: currentUserId },
          update: { $inc: { numFollowing: -1 }},
        }
      },
      // Remove currentUser from userToUnfollow's follower's list
      {
        updateOne: {
          filter: { _id: userToUnfollowId },
          update: {
            $pull: { followers: currentUserId },
            $inc: { numFollowers: -1 },
          },
        }
      },
    ])
    return { ok: true }
  } else {
    return { ok: false }
  }
}

export const handleRequest = async (currentUserId: Types.ObjectId, userToRequestId: Types.ObjectId): Promise<{ ok: boolean }> => {
  if (currentUserId === userToRequestId) {
    return { ok: false }
  }
  const res = await User.bulkWrite([
    {
      updateOne: {
        filter: { _id: currentUserId },
        update: { $addToSet: { followRequestsSent: userToRequestId }},
      }
    },
    {
      updateOne: {
        filter: { _id: userToRequestId },
        update: { $addToSet: { followRequestsReceived: currentUserId }},
      }
    },
  ])
  return { ok: res.modifiedCount === 2 }
}

// Same but pull instead of addToSet
export const handleDeleteRequest = async (currentUserId: Types.ObjectId, userToDeleteRequestId: Types.ObjectId): Promise<{ ok: boolean }> => {
  if (currentUserId === userToDeleteRequestId) {
    return { ok: false }
  }
  const res = await User.bulkWrite([
    {
      updateOne: {
        filter: { _id: currentUserId },
        update: { $pull: { followRequestsSent: userToDeleteRequestId }},
      }
    },
    {
      updateOne: {
        filter: { _id: userToDeleteRequestId },
        update: { $pull: { followRequestsReceived: currentUserId }},
      }
    },
  ])
  return { ok: res.modifiedCount === 2 }
}
