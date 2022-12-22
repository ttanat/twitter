import mongoose from "mongoose"

const config = useRuntimeConfig()

export default async () => {
  try {
    mongoose.set("strictQuery", false)
    await mongoose.connect(config.MONGO_URI)
    console.log("Connected to db")
  } catch (err) {
    console.log(err)
  }
}
