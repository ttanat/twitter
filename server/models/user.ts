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
  following: Types.Array<Types.ObjectId>
  followers: Types.Array<Types.ObjectId>
  numFollowing: number
  numFollowers: number
  likes: Types.Array<Types.ObjectId>
  bookmarks: Types.Array<Types.ObjectId>
  pollsVoted: Types.Array<{
    _id: Types.ObjectId
    choice: string
  }>
  lastActive: Date
  email?: string
  validRefreshTokens: Types.Array<string>
  isPrivate?: boolean
  isSuspended?: boolean
  isDeactivated?: boolean
  isDeleted?: boolean
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    index: { unique: true, collation: { locale: "en", strength: 2 }},
    maxlength: 32,
    trim: true,
    match: /^\w{3,32}$/,
  },
  password: { type: String, required: true },
  name: { type: String, maxlength: 32, trim: true },
  image: String,
  banner: String,
  bio: { type: String, maxlength: 150, trim: true },
  isVerified: Boolean,
  numTweets: { type: Number, default: 0, min: 0 },
  dateJoined: { type: Date, default: Date.now, immutable: true },

  following: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    validate: [(val: Types.Array<Types.ObjectId>): boolean => val.length <= 5000, "Follow limit reached"]
  },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  numFollowing: { type: Number, default: 0, min: 0, max: 5000 },
  numFollowers: { type: Number, default: 0, min: 0 },

  likes: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  pollsVoted: [{
    _id: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
    choice: { type: String, required: true, maxlength: 25 },
  }],

  lastActive: { type: Date, default: Date.now },
  email: {
    type: String,
    unique: true,
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i
  },
  validRefreshTokens: [{ type: String, match: /^[\w-]+\.[\w-]+\.[\w-]+$/ }],

  isPrivate: Boolean,
  isSuspended: Boolean,
  isDeactivated: Boolean,
  isDeleted: Boolean,
})

export default model<IUser>("User", userSchema)
