import { model, Schema, Types } from "mongoose";
import { counter, IChartData, chartData } from "./helpers";

interface ITweetAnalytics {
  tweet: Types.ObjectId
  startDate: Date
  endDate: Date
  numViews: number
  viewData: Types.Array<IChartData>
  numEngagements: number
  engagementData: Types.Array<IChartData>
  numLikes: number
  numUnlikes: number
  likeData: Types.Array<IChartData>
  numRetweets: number
  numUnretweets: number
  retweetData: Types.Array<IChartData>
  numQuotes: number
  numUnquotes: number
  quoteData: Types.Array<IChartData>
  numReplies: number
  replyData: Types.Array<IChartData>
  numBookmarks: number
  numUnbookmarks: number
  bookmarkData: Types.Array<IChartData>
}

const tweetAnalyticsSchema = new Schema<ITweetAnalytics>({
  tweet: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  // Views
  numViews: counter,
  viewData: [chartData],
  // Engagement
  numEngagements: counter,
  engagementData: [chartData],
  // Likes
  numLikes: counter,
  numUnlikes: counter,
  likeData: [chartData],
  // Retweets
  numRetweets: counter,
  numUnretweets: counter,
  retweetData: [chartData],
  // Quote tweets
  numQuotes: counter,
  numUnquotes: counter,
  quoteData: [chartData],
  // Replies
  numReplies: counter,
  replyData: [chartData],
  // Bookmarks
  numBookmarks: counter,
  numUnbookmarks: counter,
  bookmarkData: [chartData],
})

export default model<ITweetAnalytics>("TweetAnalytics", tweetAnalyticsSchema)
