import { model, Schema, Types } from "mongoose";

interface IActor {
  user: Types.ObjectId
  action: number
  timestamp: Date
}

const actorSchema = new Schema<IActor>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  action: { type: Number, required: true, default: 1, enum: [1, -1] },
  timestamp: { type: Date, required: true, default: Date.now, immutable: true },
})

interface IUserAnalytics {
  numProfileVisits: number
  profileVisitedBy: Types.Array<IActor>
  numFollows: number
  numUnfollows: number
  followedBy: Types.Array<IActor>
  numMentions: number
  mentionedBy: Types.Array<IActor>
}

interface ITweetAnalytics {
  numViews: number
  viewedBy: Types.Array<IActor>
  numEngagements: number
  engagedBy: Types.Array<IActor>
  numLikes: number
  numUnlikes: number
  likedBy: Types.Array<IActor>
  numRetweets: number
  numUnretweets: number
  retweetedBy: Types.Array<IActor>
  numQuotes: number
  numUnquotes: number
  quotedBy: Types.Array<IActor>
  numReplies: number
  repliedBy: Types.Array<IActor>
  numBookmarks: number
  numUnbookmarks: number
  bookmarkedBy: Types.Array<IActor>
}

interface IAnalytics extends IUserAnalytics, ITweetAnalytics {
  startDate: Date
  endDate: Date
  target: Types.ObjectId
  targetModel: string
}

const analyticsSchema = new Schema<IAnalytics>({
  // First day of current month
  startDate: {
    type: Date,
    required: true,
    default: function () {
      const d = new Date()
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), 1)
    }
  },
  // Last day of current month (1ms before next month)
  endDate: {
    type: Date,
    required: true,
    default: function () {
      const d: Date = this.startDate
      return new Date(d.getUTCFullYear(), d.getUTCMonth() + 1, 1).getTime() - 1
    }
  },
  target: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "targetModel",
  },
  targetModel: {
    type: String,
    required: true,
    enum: ["Tweet", "User"],
  },

  /*
    For user
  */
  // Profile visits
  numProfileVisits: { type: Number, min: 0 },
  profileVisitedBy: [actorSchema],
  // Following
  numFollows: { type: Number, min: 0 },
  numUnfollows: { type: Number, min: 0 },
  followedBy: [actorSchema],
  // Mentions
  numMentions: { type: Number, min: 0 },
  mentionedBy: [actorSchema],

  /*
    For tweet
  */
  // Views and engagement
  numViews: { type: Number, min: 0 },
  viewedBy: [actorSchema],
  numEngagements: { type: Number, min: 0 },
  engagedBy: [actorSchema],
  // Likes
  numLikes: { type: Number, min: 0 },
  numUnlikes: { type: Number, min: 0 },
  likedBy: [actorSchema],
  // Retweets
  numRetweets: { type: Number, min: 0 },
  numUnretweets: { type: Number, min: 0 },
  retweetedBy: [actorSchema],
  // Quote tweets
  numQuotes: { type: Number, min: 0 },
  numUnquotes: { type: Number, min: 0 },
  quotedBy: [actorSchema],
  // Replies
  numReplies: { type: Number, min: 0 },
  repliedBy: [actorSchema],
  // Bookmarks
  numBookmarks: { type: Number, min: 0 },
  numUnbookmarks: { type: Number, min: 0 },
  bookmarkedBy: [actorSchema],
})

export default model<IAnalytics>("Analytics", analyticsSchema)
