import User from "@/server/models/user"
import { ci } from "~~/server/utils/collations"
import { getNextUrl } from "~~/server/utils/getNextUrl"
import { checkPageNumber } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  if (!event.context.user) {
    return createError({ statusCode: 400 })
  }
  const { username } = event.context.user
  // Get page number
  const page = parseInt(getQuery(event).page as string)
  if (!checkPageNumber(page)) {
    return createError({ statusCode: 400 })
  }
  // Get slice for bookmarks array
  const slice = [page * -25, 25]

  const user = await User.findOne({ username }, {
    _id: 0,
    username: 1, // Select random field to prevent mongoose from selecting every field
    bookmarks: { $slice: ["$bookmarks", ...slice] },
  })
    .collation(ci)
    .populate("bookmarks")
    .exec()

  let next = null
  if (user!.bookmarks.length > 25) {
    next = getNextUrl(event, { page: (page + 1).toString() })
  }

  return {
    results: user!.bookmarks,
    next,
  }
})
