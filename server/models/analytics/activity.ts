import { model, Schema, Types } from "mongoose";

interface IAct {
  target: Types.ObjectId
  targetModel: string
  action?: number
  timestamp: Date
}

const actSchema = new Schema<IAct>({
  target: { type: Schema.Types.ObjectId, required: true, refPath: "targetModel" },
  targetModel: { type: String, required: true, enum: ["Tweet", "User"] },
  action: { type: Number, required: false, enum: [1, -1] }, // e.g. 1 for follow, -1 for unfollow
  timestamp: { type: Date, required: true, default: Date.now, immutable: true },
})

interface IActivity {
  user: Types.ObjectId
  views: Types.Array<IAct>
  engagements: Types.Array<IAct>
  follows: Types.Array<IAct>
  likes: Types.Array<IAct>
  retweets: Types.Array<IAct>
  quotes: Types.Array<IAct>
  bookmarks: Types.Array<IAct>
}

const activitySchema = new Schema<IActivity>({
  // User doing action
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  // Activities (what user did)
  views: [actSchema],
  engagements: [actSchema], // click on tweet or media
  follows: [actSchema],
  likes: [actSchema],
  retweets: [actSchema],
  quotes: [actSchema],
  bookmarks: [actSchema],
})

export default model<IActivity>("Activity", activitySchema)
