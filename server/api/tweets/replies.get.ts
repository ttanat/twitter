import Tweet from "~~/server/models/tweet"
import { getNextUrl } from "~~/server/utils/getNextUrl"
import { checkLikesAndRetweets } from "~~/server/utils/likesAndRetweets"
import { checkDateString, checkId } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  const { _id, before } = getQuery(event)
  if (!checkId(_id) || !checkDateString(before)) {
    return createError({ statusCode: 400 })
  }

  const replies = await Tweet
    .find({ parent: _id, timestamp: { $lt: before } }, {}, { limit: 20, sort: { timestamp: -1 } })
    .populate("user", "-_id username name image")
    .exec()

  let next = null
  if (replies.length === 20) {
    next = getNextUrl(event, {
      _id: _id!.toString(),
      before: replies[replies.length - 1].timestamp.toISOString()
    })
  }

  return {
    results: await checkLikesAndRetweets(event, replies),
    next,
  }
})
