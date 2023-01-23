import { Types } from "mongoose"
import Tweet from "~~/server/models/tweet"
import { checkUsername } from "~~/server/utils/query"

interface ITweetToEdit {
  user: { username: string }
  content?: string
  media?: Types.Array<string>
  poll?: {
    choices: Types.Array<{ choice: string; numVotes: number }>
    expiry: Date
  }
  timestamp: Date
  numReplies: number
  isRemoved?: boolean
  isDeleted?: boolean
}

export default defineEventHandler(async event => {
  const username: string | null = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  let { _id, content } = await readBody(event)
  if (!_id) {
    return createError({ statusCode: 400 })
  }

  const tweet: ITweetToEdit | null = await Tweet.findOne({ _id }, {
    _id: 0,
    content: 1,
    media: 1,
    poll: 1,
    timestamp: 1,
    numReplies: 1,
    isRemoved: 1,
    isDeleted: 1,
  }).populate<{ user: { username: string }}>("user", "-_id username").exec()

  if (!tweet || tweet.isRemoved || tweet.isDeleted) return createError({ statusCode: 400 })
  // Check user is editing their own tweet
  if (username !== tweet.user.username) return createError({ statusCode: 400 })
  // Only allow users to edit within 5 minutes of posting and if no one has replied
  if (Date.now() - tweet.timestamp.valueOf() > 1000 * 60 * 5 || tweet.numReplies > 0) {
    return createError({ statusCode: 400, statusMessage: "Cannot edit anymore" })
  }

  content = content.slice(0, 300).trim()
  // All fields can't be empty
  if (!content && !tweet.media?.length && !tweet.poll?.choices.length) {
    return createError({ statusCode: 400 })
  }

  await Tweet.updateOne({ _id }, { content }).exec()

  return null
})
