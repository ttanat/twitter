import User, { ci } from "~~/server/models/user"

export default defineEventHandler(async event => {
  const { tweet_id } = getQuery(event)
  if (!event.context.user?.username) {
    return { voted: false }
  }

  // Check if user voted in poll
  const user = await User.findOne({ username: event.context.user.username, "pollsVoted._id": tweet_id }).collation(ci).exec()

  return { voted: !!user }
})
