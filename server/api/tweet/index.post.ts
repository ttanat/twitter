import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkUsername } from "~~/server/utils/query"
import { Content, Files, Poll, parsePoll, validateTweetFormData, getHashtags, getMentions } from "~~/server/utils/tweet"

export default defineEventHandler(async event => {
  // Get username
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  // Get user
  const user = await User.findOne({ username }, { _id: 1, isPrivate: 1 }).collation(ci).exec()
  if (!user) {
    return createError({ statusCode: 400 })
  }

  // Get tweet
  const { content, files, poll }: {
    content: Content
    files: Files
    poll: Poll
  } = await readBody(event)

  // Slice and trim content
  const parsedContent = content?.slice(0, 300).trim()
  // Validate choices and add expiry if none
  const parsedPoll = parsePoll(poll)

  if (!validateTweetFormData(parsedContent, files, parsedPoll)) {
    return createError({ statusCode: 400 })
  }

  await Tweet.create({
    user: user._id,
    content: parsedContent,
    // media: files,
    poll: parsedPoll,
    hashtags: getHashtags(parsedContent),
    mentions: getMentions(parsedContent),
    isPrivate: user.isPrivate,
  })

  return null
})
