import User from "@/server/models/user"
import { Types } from "mongoose"

export const handleFollow = async (currentUserId: Types.ObjectId, userToFollowId: Types.ObjectId): Promise<{ ok: boolean }> => {
  // Check not following self
  if (currentUserId === userToFollowId) {
    return { ok: false }
  }
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
