import { model, Schema, Types } from "mongoose";

interface IUser {
  username: string
  password: string
  name?: string
  image?: string
  banner?: string
  bio?: string
  isVerified?: boolean
  numTweets: number
  dateJoined: Date
  following: Array<IUser>
  followers: Array<IUser>
  numFollowing: number
  numFollowers: number
  likes: Array<Types.ObjectId>
  bookmarks: Array<Types.ObjectId>
  pollsVoted: Array<IPollsVoted>
  numReplies: number
  numPoints: number
  lastActive: Date
  email?: string
  validRefreshTokens: Array<string>
  isTweetsLimited?: boolean
  isRepliesLimited?: boolean
  isSuspended?: boolean
  isDeactivated?: boolean
  isDeleted?: boolean
}

interface IPollsVoted {
  _id: Types.ObjectId
  choice: string
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    index: { unique: true, collation: { locale: "en", strength: 2 }},
    maxlength: 32,
    trim: true,
    match: /\w{3,32}/,
  },
  password: { type: String, required: true },
  name: { type: String, maxlength: 32, trim: true },
  image: String,
  banner: String,
  bio: { type: String, maxlength: 150, trim: true },
  isVerified: Boolean,
  numTweets: { type: Number, default: 0 },
  dateJoined: { type: Date, default: () => new Date(), immutable: true },

  following: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    validate: [(followingList: Array<Object>) => followingList.length <= 5000, "Follow limit reached"]
  },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  numFollowing: { type: Number, default: 0, max: 5000 },
  numFollowers: { type: Number, default: 0 },

  likes: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  pollsVoted: [{
    _id: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
    choice: { type: String, required: true },
  }],

  numReplies: { type: Number, default: 0 },
  numPoints: { type: Number, default: 0 }, // Number of likes on user's tweets and replies
  lastActive: { type: Date, default: () => new Date() },
  email: {
    type: String,
    unique: true,
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i
  },
  validRefreshTokens: [{ type: String, match: /^[\w-]+\.[\w-]+\.[\w-]+$/ }],

  isTweetsLimited: Boolean,
  isRepliesLimited: Boolean,
  isSuspended: Boolean,
  isDeactivated: Boolean,
  isDeleted: Boolean,
})

export default model<IUser>("User", userSchema)
