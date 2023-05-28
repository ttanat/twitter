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
  followRequestsSent: Types.Array<Types.ObjectId>
  followRequestsReceived: Types.Array<Types.ObjectId>
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
  test?: Types.Array<string>
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
  bio: { type: String, maxlength: 150, trim: true, default: "" },
  isVerified: Boolean,
  numTweets: { type: Number, default: 0, min: 0 },
  dateJoined: { type: Date, default: Date.now, immutable: true },

  // following is important
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    validate: [(val: Types.Array<Types.ObjectId>): boolean => val.length <= 5000, "Follow limit reached"]
  },
  // followers not important
  // Only used for showing followers so length is limited to 5000 in application (~/server/utils/follow)
  followers: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    validate: [(val: Types.Array<Types.ObjectId>): boolean => val.length <= 5000, "Maximum 5000"]
  },
  numFollowing: { type: Number, default: 0, min: 0, max: 5000 },
  numFollowers: { type: Number, default: 0, min: 0 },
  followRequestsSent: [{ type: Schema.Types.ObjectId }],
  followRequestsReceived: [{ type: Schema.Types.ObjectId }],

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

  isPrivate: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  test: [String],
})

userSchema.index({ username: "text", name: "text" })

export default model<IUser>("User", userSchema)

interface ICollation {
  readonly locale: string
  readonly caseLevel?: boolean
  readonly caseFirst?: string
  readonly strength?: number
  readonly numericOrdering?: boolean
  readonly alternate?: string
  readonly maxVariable?: string
  readonly backwards?: boolean
}

interface ICaseInsensitiveCollation extends ICollation {
  readonly strength: number
}

// Case-insensitive
export const ci: ICaseInsensitiveCollation = { locale: "en", strength: 2 }
