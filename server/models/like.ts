import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Types.ObjectId, required: true },
  },
  tweet: {
    id: { type: mongoose.Types.ObjectId, required: true },
  },
  point: { type: Number, validate: (val: Number) => val === 1 || val === -1 },
  timestamp: { type: Date, default: () => new Date(), immutable: true },
})

likeSchema.index({ "user.id": 1, "tweet.id": 1 }, { unique: true })

const collectionName = "likes"
module.exports = mongoose.model("Like", likeSchema, collectionName)
