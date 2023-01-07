import { model, Schema, Types } from "mongoose";

export interface IActor {
  user: Types.ObjectId
  action: number
  timestamp: Date
}

export const actorSchema = new Schema<IActor>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  action: { type: Number, required: true, default: 1, enum: [1, -1] },
  timestamp: { type: Date, required: true, default: Date.now, immutable: true },
})

export interface IAnalytics {
  startDate: Date
  endDate: Date
  target: Types.ObjectId
  targetModel: string
}

const analyticsSchema = new Schema<IAnalytics>({
  // First day of current month
  startDate: {
    type: Date,
    required: true,
    default: function () {
      const d = new Date()
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), 1)
    }
  },
  // Last day of current month (1ms before next month)
  endDate: {
    type: Date,
    required: true,
    default: function () {
      const d: Date = this.startDate
      return new Date(d.getUTCFullYear(), d.getUTCMonth() + 1, 1).getTime() - 1
    }
  },
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
})

export const Analytics = model<IAnalytics>("Analytics", analyticsSchema)
