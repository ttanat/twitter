import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  choices: {
    type: [{
      choice: { type: String, maxlength: 25 },
      numVotes: { type: Number, default: 0 },
    }],
    validate: [
      { validator: (choices: Array<Object>) => choices.length >= 2, msg: "At least 2 choices needed" },
      { validator: (choices: Array<Object>) => choices.length <= 6, msg: "Maximum 6 choices" },
      { validator: (choices: Array<Object>) => new Set(choices).size === choices.length, msg: "No duplicates allowed" },
    ],
  },
  totalNumVotes: { type: Number, default: 0 },
  expiry: { type: Date, default: () => new Date(Date.now() + 86_400_000) }, // Default is 1 day in future
})

const tweetSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Types.ObjectId, required: true },
    name: String,
    username: { type: String, required: true },
    image: String,
  },

  content: { type: String },
  quotedTweet: { type: mongoose.Types.ObjectId },
  timestamp: { type: Date, default: () => new Date(), immutable: true },
  effectiveTimestamp: { type: Date, default: () => new Date() },
  media: [String],
  poll: pollSchema,
  hashtags: [{
    type: String,
    match: /^#[a-zA-Z]\w{0,31}$/i,
  }],

  numReplies: { type: Number, default: 0 },
  numRetweets: { type: Number, default: 0 },
  numQuotes: { type: Number, default: 0 },
  numLikes: { type: Number, default: 0 },
  numDislikes: { type: Number, default: 0 },

  isReply: Boolean,
  root: {
    id: mongoose.Types.ObjectId
  },
  parent: {
    username: String, // For saying "Replying to @..."
    id: mongoose.Types.ObjectId,
  },
  children: [{
    id: mongoose.Types.ObjectId
  }],

  isLimited: Boolean,
  isRemoved: Boolean,
  isDeleted: Boolean,
})

tweetSchema.pre("save", function(next) {
  if (!this.content && !this.media?.length && !this.poll) {
    return next(new Error("Can't be empty"))
  }
  if (this.poll && this.media?.length) {
    return next(new Error("Polls can't contain media"))
  }
  next()
})

export default mongoose.model("Tweet", tweetSchema)
