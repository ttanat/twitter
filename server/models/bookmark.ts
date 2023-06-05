import { model, Schema, Types } from "mongoose";

interface IBookmark {
  user: Types.ObjectId
  targetTweet: Types.ObjectId
  timestamp: Date
}

const bookmarkSchema = new Schema<IBookmark>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  targetTweet: { type: Schema.Types.ObjectId, required: true, ref: "Tweet" },
  timestamp: { type: Date, default: Date.now, immutable: true },
})

bookmarkSchema.index({ user: 1, timestamp: -1 }) // For /api/tweets/bookmarks
bookmarkSchema.index({ user: 1, targetTweet: 1 }, { unique: true }) // For uniqueness

export default model<IBookmark>("Bookmark", bookmarkSchema)
