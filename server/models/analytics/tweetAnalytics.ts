import { model, Schema, Types } from "mongoose";
import { actorSchema, IActor } from "./actorSchema";

interface ITweetAnalytics {
  startDate: Date
  endDate: Date
  target: Types.ObjectId
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

const tweetAnalyticsSchema = new Schema<ITweetAnalytics>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  target: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
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

export default model<ITweetAnalytics>("TweetAnalytics", tweetAnalyticsSchema)
