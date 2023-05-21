import Tweet from "~~/server/models/tweet"
import User, { ci } from "~~/server/models/user"
import { checkUsername } from "~~/server/utils/query"

export default defineEventHandler(async event => {
  // Get username
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  // Get user
  const user = await User.findOne({ username }, { _id: 1, pollsVoted: 1 }).collation(ci).exec()
  if (!user) {
    return createError({ statusCode: 400 })
  }

  // Get POST body
  const { tweet_id, choice }: {
    tweet_id: string
    choice: string
  } = await readBody(event)

  if (!tweet_id || !choice) {
    return createError({ statusCode: 400 })
  }

  // Check user hasn't already voted in this poll
  if (await User.findOne({ _id: user._id, "pollsVoted._id": tweet_id }).exec()) {
    return createError({ statusCode: 400 })
  }

  // Get tweet
  const tweet = await Tweet.findOne({ _id: tweet_id }).exec()

  if (!tweet || !tweet.poll) {
    return createError({ statusCode: 400 })
  }

  // Check poll expiration
  const now = new Date()
  if (now > tweet.poll.expiry) {
    return createError({ statusCode: 400 })
  }

  // Check choice selected is valid
  const selectedChoice = tweet.poll?.choices.find(tmp => tmp.choice === choice)
  if (!selectedChoice) {
    return createError({ statusCode: 400 })
  }

  selectedChoice.numVotes += 1
  tweet.poll.totalNumVotes += 1
  tweet.save()
  user.pollsVoted.push({ _id: tweet_id, choice })
  user.save()

  return null
})
