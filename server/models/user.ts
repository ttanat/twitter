import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true, collation: { locale: "en", strength: 2 }},
    maxlength: 32,
    trim: true,
    match: /\w{1,32}/,
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
    type: [{
      id: { type: mongoose.Types.ObjectId, required: true },
      followedOn: { type: Date, required: true }
    }],
    validate: [(followingList: Array<Object>) => followingList.length <= 5000, "Follow limit reached"]
  },
  followers: [{
    id: { type: mongoose.Types.ObjectId, required: true },
    followedOn: { type: Date, required: true }
  }],
  numFollowing: { type: Number, default: 0, max: 5000 },
  numFollowers: { type: Number, default: 0 },

  likes: [{ id: mongoose.Types.ObjectId }],
  bookmarks: [{ id: mongoose.Types.ObjectId }],
  pollsVoted: [{ id: mongoose.Types.ObjectId, choice: String }],

  numReplies: { type: Number, default: 0 },
  numPoints: { type: Number, default: 0 }, // Number of likes on user's tweets and replies
  lastActive: { type: Date, default: () => new Date() },
  email: {
    type: String,
    unique: true,
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i
  },
  isTweetsLimited: Boolean,
  isRepliesLimited: Boolean,
  isSuspended: Boolean,
  isDeactivated: Boolean,
  isDeleted: Boolean,
})

export default mongoose.model("User", userSchema)
