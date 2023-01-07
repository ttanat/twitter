import { model, Schema, Types } from "mongoose";
import { actorSchema, IActor } from "./actorSchema";

interface IUserAnalytics {
  startDate: Date
  endDate: Date
  target: Types.ObjectId
  numProfileVisits: number
  profileVisitedBy: Types.Array<IActor>
  numFollows: number
  numUnfollows: number
  followedBy: Types.Array<IActor>
  numMentions: number
  mentionedBy: Types.Array<IActor>
}

const userAnalyticsSchema = new Schema<IUserAnalytics>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  target: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
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

export default model<IUserAnalytics>("UserAnalytics", userAnalyticsSchema)
