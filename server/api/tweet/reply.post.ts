import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkIsFollowing } from "~~/server/utils/following"
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
  const { replyTo, content, files, poll }: {
    replyTo: string
    content: Content
    files: Files
    poll: Poll
  } = await readBody(event)

  // Slice and trim content
  const parsedContent = content?.slice(0, 300).trim()
  // Validate choices and add expiry if none
  const parsedPoll = parsePoll(poll)

  // Check form data
  if (!validateTweetFormData(parsedContent, files, parsedPoll)) {
    return createError({ statusCode: 400 })
  }

  // Get tweet/reply that user is replying to
  const parent = await Tweet.findOne(
    { _id: replyTo },
    { _id: 1, ancestors: 1, isPrivate: 1, isRemoved: 1, isDeleted: 1 },
  ).populate("user", "_id username").exec()

  if (!parent || parent.isRemoved || parent.isDeleted) {
    return createError({ statusCode: 404 })
  }

  // If parent is private, check if user can reply
  if (parent.isPrivate) {
    // Can reply if user is replying to self or user is following tweeter
    const canReply = user._id === parent.user._id || await checkIsFollowing(username, parent.user._id)
    if (!canReply) {
      return createError({ statusCode: 400 })
    }
  }

  const reply = await Tweet.create({
    user: user._id,
    content: parsedContent,
    // media: files,
    poll: parsedPoll,
    hashtags: getHashtags(parsedContent),
    mentions: getMentions(parsedContent),
    ancestors: parent.ancestors?.length ? [...parent.ancestors, parent._id] : [parent._id],
    parent: parent._id,
    replyingTo: parent.user.username,
    isPrivate: user.isPrivate,
  })

  // Increment reply count on tweet/reply that user is replying to
  await Tweet.updateOne({ _id: replyTo }, { $inc: { numReplies: 1 }}).exec()

  const response = await reply.populate("user", "-_id username name image")

  return response
})
