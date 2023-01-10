import User from "@/server/models/user"
import { ci } from "~~/server/utils/collations"

export default eventHandler(async event => {
  const { username } = getQuery(event)
  const user = await User.findOne({ username }, { _id: 0, username: 1, name: 1, image: 1 })
    .collation(ci)
    .exec()

  return user ? user : createError({ statusCode: 404, statusMessage: "User not found" })
})
