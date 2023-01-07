import { model, Schema, Types } from "mongoose";

interface IActivity {
  user: Types.ObjectId
  action: string
  target: Types.ObjectId
  targetModel: string
  timestamp: Date
}

const activitySchema = new Schema<IActivity>({
  // User doing action
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  // What user did
  action: {
    type: String,
    required: true,
    enum: [
      "liked", "unliked",
      "followed", "unfollowed",
      "bookmarked", "unbookmarked",
      "viewed", // view profile (user) or tweet
    ]
  },
  // e.g. user liked post, post is target
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
  // When action occurred
  timestamp: { type: Date, required: true, default: Date.now, immutable: true },
})

export default model<IActivity>("Activity", activitySchema)
