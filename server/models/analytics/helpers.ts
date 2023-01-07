export const counter = { type: Number, default: 0, min: 0 }

export interface IChartData {
  date: Date
  value: number
}

export const chartData = {
  date: { type: Date, required: true, immutable: true },
  value: { type: Number, required: true },
}
