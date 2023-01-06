import { model, Schema, Types } from "mongoose";

interface IPoll {
  choices: Types.Array<IChoices>
  totalNumVotes: number
  expiry: Date
}

interface IChoices {
  choice: string
  numVotes: number
}

const pollSchema = new Schema<IPoll>({
  choices: {
    type: [{
      choice: { type: String, required: true, maxlength: 25, minlength: 1 },
      numVotes: { type: Number, required: true, default: 0, min: 0 },
    }],
    validate: [
      { validator: (choices: IPoll["choices"]) => choices.length >= 2, msg: "At least 2 choices needed" },
      { validator: (choices: IPoll["choices"]) => choices.length <= 6, msg: "Maximum 6 choices" },
      { validator: (choices: IPoll["choices"]) => new Set(choices).size === choices.length, msg: "No duplicates allowed" },
    ],
  },
  totalNumVotes: { type: Number, default: 0, min: 0 },
  expiry: { type: Date, required: true, default: () => Date.now() + 86_400_000 }, // Default is 1 day in future
})

interface ITweet {
  user: Types.ObjectId
  content?: string
  quotedTweet?: Types.ObjectId
  timestamp: Date
  effectiveTimestamp: Date
  media?: Types.Array<string>
  poll?: IPoll
  hashtags?: Types.Array<string>
  numReplies: number
  numRetweets: number
  numQuotes: number
  numLikes: number
  numDislikes: number
  isReply?: boolean
  root?: Types.ObjectId
  parent?: Types.ObjectId
  children?: Types.Array<Types.ObjectId>
  isLimited?: boolean
  isRemoved?: boolean
  isDeleted?: boolean
}

const tweetSchema = new Schema<ITweet>({
  user: {
    id: { type: Schema.Types.ObjectId, required: true },
    name: String,
    username: { type: String, required: true },
    image: String,
  },

  content: { type: String },
  quotedTweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
  timestamp: { type: Date, default: Date.now, immutable: true },
  effectiveTimestamp: { type: Date, default: Date.now },
  media: [String],
  poll: pollSchema,
  hashtags: [{
    type: String,
    match: /^#[a-zA-Z]\w{0,31}$/i,
  }],

  numReplies: { type: Number, default: 0, min: 0 },
  numRetweets: { type: Number, default: 0, min: 0 },
  numQuotes: { type: Number, default: 0, min: 0 },
  numLikes: { type: Number, default: 0, min: 0 },
  numDislikes: { type: Number, default: 0, min: 0 },

  isReply: Boolean,
  root: { type: Schema.Types.ObjectId, ref: "Tweet" },
  parent: { type: Schema.Types.ObjectId, ref: "Tweet" },
  children: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],

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

export default model<ITweet>("Tweet", tweetSchema)
