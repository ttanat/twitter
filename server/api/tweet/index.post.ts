import Tweet from "~~/server/models/tweet"
import User from "~~/server/models/user"
import { ci } from "~~/server/utils/collations"
import { checkDateString, checkUsername } from "~~/server/utils/query"
import { getHashtags, getMentions } from "~~/server/utils/tweet"

type Content = string | undefined

interface IPoll {
  choices: string[]
  expiry?: string // Date string
}

export default defineEventHandler(async event => {
  // Get user
  const username = event.context.user?.username
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  const user = await User.findOne({ username }, { _id: 1 }).collation(ci).exec()
  if (!user) {
    return createError({ statusCode: 400 })
  }

  // Get tweet
  const { content, files, poll }: {
    content: Content
    files: string[] | undefined
    poll: IPoll | undefined
  } = await readBody(event)

  // Slice and trim content
  const parsedContent = content?.slice(0, 300).trim()
  // Check poll
  if (poll?.choices) {
    // Slice and trim poll choices
    poll.choices = poll.choices.map(choice => choice.slice(0, 25).trim())
    for (const choice of poll.choices) {
      if (!choice) return createError({ statusCode: 400 })
    }
    // Check expiry date
    if (poll.expiry) {
      if (!checkDateString(poll.expiry)) {
        return createError({ statusCode: 400 })
      }
      // Check expiry is between now and 7 days in the future
      const [now, expiry, maxExpiry] = [new Date(), new Date(poll.expiry), new Date()]
      maxExpiry.setDate(now.getDate() + 7)
      if (expiry < now || expiry > new Date()) {
        return createError({ statusCode: 400 })
      }
    }
  }
  // Error if all empty
  if (!parsedContent && !files?.length && !poll?.choices.length) {
    return createError({ statusCode: 400 })
  }
  // Error if poll and files both present
  if (files?.length && poll?.choices.length) {
    return createError({ statusCode: 400 })
  }

  const tweet = await Tweet.create({
    user: user._id,
    content: parsedContent,
    // media: files,
    poll,
    hashtags: getHashtags(parsedContent),
    mentions: getMentions(parsedContent),
  })

  return null
})
