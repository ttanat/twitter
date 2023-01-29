import User, { ci } from "~~/server/models/user"
import { checkUsername } from "~~/server/utils/query"
import { Types } from "mongoose"

type Username = string | undefined
type Id = Types.ObjectId | string | undefined

export const checkIsFollowing = async (user1Username: Username, user2Id: Id): Promise<boolean> => {
  /*
    Check if user 1 is following user 2
  */
  if (!user1Username || !user2Id || !checkUsername(user1Username)) {
    return false
  }

  const check = await User.findOne(
    { username: user1Username },
    { _id: 0, following: { $elemMatch: { $eq: user2Id }}},
  ).collation(ci).exec()

  return check?.following.length === 1
}

export const checkIsFollowingOrRequesting = async (user1Username: Username, user2Id: Id): Promise<{ isFollowing: boolean; isRequestingFollow: boolean }> => {
  /*
    Check if user 1 is following or requesting to follow user 2
  */
  if (!user1Username || !user2Id || !checkUsername(user1Username)) {
    return { isFollowing: false, isRequestingFollow: false }
  }

  const check = await User.findOne({ username: user1Username }, {
    _id: 0,
    following: { $elemMatch: { $eq: user2Id }},
    followRequestsSent: { $elemMatch: { $eq: user2Id }},
  }).collation(ci).exec()

  return {
    isFollowing: check?.following.length === 1,
    isRequestingFollow: check?.followRequestsSent.length === 1
  }
}
