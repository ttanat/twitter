import { model, Schema, Types } from "mongoose";

interface ILike {
  user: Types.ObjectId
  targetTweet: Types.ObjectId
  timestamp: Date
}

const likeSchema = new Schema<ILike>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  targetTweet: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
  timestamp: { type: Date, default: Date.now, immutable: true },
})

likeSchema.index({ user: 1, timestamp: -1 }) // For /api/tweets/likes
likeSchema.index({ user: 1, targetTweet: 1 }, { unique: true }) // For checkLikes in utils

export default model<ILike>("Like", likeSchema)
