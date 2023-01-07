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

const counter = { type: Number, default: 0, min: 0 }

const tweetAnalyticsSchema = new Schema<ITweetAnalytics>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  target: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
  // Views
  numViews: counter,
  viewedBy: [actorSchema],
  // Engagement
  numEngagements: counter,
  engagedBy: [actorSchema],
  // Likes
  numLikes: counter,
  numUnlikes: counter,
  likedBy: [actorSchema],
  // Retweets
  numRetweets: counter,
  numUnretweets: counter,
  retweetedBy: [actorSchema],
  // Quote tweets
  numQuotes: counter,
  numUnquotes: counter,
  quotedBy: [actorSchema],
  // Replies
  numReplies: counter,
  repliedBy: [actorSchema],
  // Bookmarks
  numBookmarks: counter,
  numUnbookmarks: counter,
  bookmarkedBy: [actorSchema],
})

export default model<ITweetAnalytics>("TweetAnalytics", tweetAnalyticsSchema)
