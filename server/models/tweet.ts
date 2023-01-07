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
  user: {
    _id: Types.ObjectId
    name?: string
    username: string
    image?: string
  }
  content?: string
  quotedTweet?: Types.ObjectId
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
  ancestors?: Types.Array<Types.ObjectId>
  parent?: Types.ObjectId
  isPrivate?: boolean
  isRemoved?: boolean
  isDeleted?: boolean
}

const tweetSchema = new Schema<ITweet>({
  user: {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: String,
    username: { type: String, required: true },
    image: String,
  },

  content: { type: String, maxlength: 300, trim: true },
  quotedTweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
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

  ancestors: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  parent: { type: Schema.Types.ObjectId, ref: "Tweet" },

  isPrivate: Boolean,
  isRemoved: Boolean,
  isDeleted: Boolean,
})

tweetSchema.pre("save", function(next) {
  if (!this.content && !this.media?.length && !this.poll) {
    next(new Error("Can't be empty"))
  }
  if (this.poll && this.media?.length) {
    next(new Error("Polls can't contain media"))
  }
  next()
})

export default model<ITweet>("Tweet", tweetSchema)
