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

const counter = { type: Number, default: 0, min: 0 }

const userAnalyticsSchema = new Schema<IUserAnalytics>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  target: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
  // Profile visits
  numProfileVisits: counter,
  profileVisitedBy: [actorSchema],
  // Following
  numFollows: counter,
  numUnfollows: counter,
  followedBy: [actorSchema],
  // Mentions
  numMentions: counter,
  mentionedBy: [actorSchema],
})

export default model<IUserAnalytics>("UserAnalytics", userAnalyticsSchema)
