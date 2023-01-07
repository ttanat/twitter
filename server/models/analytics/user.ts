import { model, Schema, Types } from "mongoose";
import { counter, IChartData, chartData } from "./helpers";

interface IUserAnalytics {
  user: Types.ObjectId
  startDate: Date
  endDate: Date
  numProfileVisits: number
  profileVisitData: Types.Array<IChartData>
  numFollows: number
  numUnfollows: number
  followData: Types.Array<IChartData>
  numMentions: number
  mentionData: Types.Array<IChartData>
}

const userAnalyticsSchema = new Schema<IUserAnalytics>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  // Profile visits
  numProfileVisits: counter,
  profileVisitData: [chartData],
  // Following
  numFollows: counter,
  numUnfollows: counter,
  followData: [chartData],
  // Mentions
  numMentions: counter,
  mentionData: [chartData],
})

export default model<IUserAnalytics>("UserAnalytics", userAnalyticsSchema)
