import { model, Schema, Types } from "mongoose";

interface ILike {
  user: Types.ObjectId
  tweet: Types.ObjectId
  point: number
  timestamp: Date
}

const likeSchema = new Schema<ILike>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  tweet: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
  point: { type: Number, required: true, enum: [1, -1] },
  timestamp: { type: Date, default: Date.now, immutable: true },
})

likeSchema.index({ "user.id": 1, "tweet.id": 1 }, { unique: true })

export default model<ILike>("Like", likeSchema)
