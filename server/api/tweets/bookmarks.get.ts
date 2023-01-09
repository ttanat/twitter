import User from "@/server/models/user"
import { getNextUrl } from "~~/server/utils/getNextUrl"

export default defineEventHandler(async event => {
  if (!event.context.user) {
    return createError({ statusCode: 400 })
  }
  const { username } = event.context.user
  // Get page number
  const page = parseInt(getQuery(event).page as string) || 1
  // Get slice for bookmarks array
  const slice = [page * -25, 25]

  const user = await User.findOne({ username }).select({
    _id: 0,
    username: 1, // Select random field to prevent mongoose from selecting every field
    bookmarks: { $slice: ["$bookmarks", ...slice] },
  }).populate("bookmarks").exec()

  let next = null
  if (user!.bookmarks.length > 25) {
    next = getNextUrl(event, { page: (page + 1).toString() })
  }

  return {
    results: user!.bookmarks,
    next,
  }
})
