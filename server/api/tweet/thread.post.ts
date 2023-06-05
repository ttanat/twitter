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

  // Get thread
  const { thread } : { thread: any[] } = await readBody(event)

  // Check thread length
  if (thread.length > 10 || thread.length < 2) {
    return createError({ statusCode: 400 })
  }

  // Validate all tweets in thread
  for (let i = 0, n = thread.length; i < n; i++) {
    const tmp = thread[i]
    // Slice and trim content
    tmp.content = tmp.content?.slice(0, 300).trim()
    // Validate choices and add expiry if none
    tmp.poll = parsePoll(tmp.poll)
  
    if (!validateTweetFormData(tmp.content, tmp.files, tmp.poll)) {
      return createError({ statusCode: 400 })
    }
  }

  let parent = undefined
  let ancestors: any = []
  // Create tweets
  for (let i = 0, n = thread.length; i < n; i++) {
    const { content, files, poll }: { content: Content, files: Files, poll: Poll } = thread[i]
    // Create tweet
    const tweet: any = await Tweet.create({
      user: user._id,
      content: content,
      // media: files,
      poll: poll,
      hashtags: getHashtags(content),
      mentions: getMentions(content),
      isPrivate: user.isPrivate,
      parent,
      ancestors,
    })
    // Update parent and ancestors
    parent = tweet._id
    ancestors = [...ancestors, tweet._id]
  }

  return null
})
