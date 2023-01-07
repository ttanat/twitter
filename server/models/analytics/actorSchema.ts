import { Schema, Types } from "mongoose";

export interface IActor {
  user: Types.ObjectId
  action: number
  timestamp: Date
}

export const actorSchema = new Schema<IActor>({
  user: { type: Schema.Types.ObjectId, required: false, ref: "User" },
  action: { type: Number, required: true, default: 1, enum: [1, -1] },
  timestamp: { type: Date, required: true, default: Date.now, immutable: true },
})
