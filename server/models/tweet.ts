import { model, Schema, Types } from "mongoose";

interface IPoll {
  choices: Types.Array<{
    choice: string
    numVotes: number
  }>
  totalNumVotes: number
  expiry: Date
}

const pollSchema = new Schema<IPoll>({
  choices: {
    type: [{
      choice: { type: String, required: true, maxlength: 25, minlength: 1 },
      numVotes: { type: Number, required: true, default: 0, min: 0 },
    }],
    validate: [
      { validator: (choices: IPoll["choices"]): boolean => choices.length >= 2, msg: "Minimum 2 choices" },
      { validator: (choices: IPoll["choices"]): boolean => choices.length <= 6, msg: "Maximum 6 choices" },
      { validator: (choices: IPoll["choices"]): boolean => new Set(choices).size === choices.length, msg: "No duplicates allowed" },
    ],
  },
  totalNumVotes: { type: Number, default: 0, min: 0 },
  expiry: { type: Date, required: true, default: () => Date.now() + 86_400_000 }, // Default is 1 day in future
})

interface ITweet {
  user: Types.ObjectId
  content?: string
  retweet?: Types.ObjectId
  quote?: Types.ObjectId
  timestamp: Date
  effectiveTimestamp: Date
  media?: Types.Array<string>
  poll?: IPoll
  hashtags?: Types.Array<string>
  mentions?: Types.Array<string>
  numReplies: number
  numRetweets: number
  numQuotes: number
  numLikes: number
  numBookmarks: number
  ancestors?: Types.Array<Types.ObjectId>
  parent?: Types.ObjectId
  isPrivate?: boolean
  isRemoved?: boolean
  isDeleted?: boolean
}

const tweetSchema = new Schema<ITweet>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },

  content: { type: String, maxlength: 300, trim: true },
  retweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
  quote: { type: Schema.Types.ObjectId, ref: "Tweet" },
  timestamp: { type: Date, default: Date.now, immutable: true },
  effectiveTimestamp: { type: Date, default: Date.now },
  media: {
    type: [String],
    validate: [(val: Types.Array<string>): boolean => val.length <= 4, "Maximum 4 media files"]
  },
  poll: pollSchema,
  hashtags: [{ type: String, match: /^[a-z]\w{0,31}$/i }],
  mentions: [{ type: String, match: /^\w{3,32}$/ }],

  numReplies: { type: Number, default: 0, min: 0 },
  numRetweets: { type: Number, default: 0, min: 0 },
  numQuotes: { type: Number, default: 0, min: 0 },
  numLikes: { type: Number, default: 0, min: 0 },
  numBookmarks: { type: Number, default: 0, min: 0 },

  ancestors: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  parent: { type: Schema.Types.ObjectId, ref: "Tweet" },

  isPrivate: Boolean,
  isRemoved: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
})

tweetSchema.pre("save", function(next) {
  // Retweet
  if (this.retweet) {
    if (this.content || this.media?.length || this.poll) {
      next(new Error("Retweet can't have content, media, or poll"))
    }
    if (this.quote) {
      next(new Error("Pick one: retweet or quote tweet"))
    }
  // Quote tweet
  } else if (this.quote) {
    if (!this.content) {
      next(new Error("Quote tweet must have content"))
    }
    if (this.media?.length || this.poll) {
      next(new Error("Quote tweet can't have media or poll"))
    }
  // Normal tweet
  } else {
    if (!this.content && !this.media?.length && !this.poll) {
      next(new Error("Tweet can't be empty"))
    }
    if (this.poll && this.media?.length) {
      next(new Error("Polls can't contain media"))
    }
  }
  next()
})

tweetSchema.index({ user: 1, retweet: 1 })
tweetSchema.index({ content: "text" })

export default model<ITweet>("Tweet", tweetSchema)
