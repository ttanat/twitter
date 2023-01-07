import { Schema, Types } from "mongoose";
import { Analytics, IAnalytics, actorSchema, IActor } from "./analytics";

interface IUserAnalytics extends IAnalytics {
  numProfileVisits: number
  profileVisitedBy: Types.Array<IActor>
  numFollows: number
  numUnfollows: number
  followedBy: Types.Array<IActor>
  numMentions: number
  mentionedBy: Types.Array<IActor>
}

const userAnalyticsSchema = new Schema<IUserAnalytics>({
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
})

export default Analytics.discriminator("UserAnalytics", userAnalyticsSchema)
