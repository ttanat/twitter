import { checkDateString } from "./query"

export type Content = string | undefined

export type Files = string[] | undefined

type ParsedChoice = {
  choice: string
  numVotes: number
}

export type Poll = {
  choices: Array<string | ParsedChoice>
  expiry?: string // Date string
} | undefined

export function parsePoll(poll: Poll): Poll {
  if (poll?.choices) {
    // Make sure choices is an array
    if (!Array.isArray(poll.choices)) {
      return undefined
    }
    // Convert to string, slice and trim poll content
    poll.choices = poll.choices.map(choice => ({
      choice: String(choice).slice(0, 25).trim(),
      numVotes: 0,
    }))
    // Add expiry (1 day from now) if none
    if (!poll.expiry) {
      const [now, expiry] = [new Date(), new Date()]
      expiry.setDate(now.getDate() + 1)
      poll.expiry = expiry.toISOString()
    }
  }

  return poll
}

export function validateTweetFormData(content: Content, files: Files, poll: Poll): boolean {
  // Check poll if exists
  if (poll) {
    // Check poll choices are not empty
    for (const c of (poll.choices as ParsedChoice[])) {
      if (!c.choice) return false
    }
    // Check between 2 and 6 choices
    if (poll.choices.length < 2 || poll.choices.length > 6) {
      return false
    }
    // Check expiry date
    if (!checkDateString(poll.expiry)) {
      return false
    }
    // Check expiry is between now and 7 days in the future
    const [now, expiry, maxExpiry] = [new Date(), new Date(poll.expiry!), new Date()]
    maxExpiry.setDate(now.getDate() + 7)
    if (expiry < now || expiry > maxExpiry) {
      return false
    }
  }
  // Error if all empty
  if (!content && !files?.length && !poll?.choices.length) {
    return false
  }
  // Error if poll and files both present
  if (files?.length && poll?.choices.length) {
    return false
  }

  return true
}

const hashtagRegExp = /(?:(?<=^|\s)(?:#[a-z]\w{0,31})(?=$|\s))/gi
const mentionRegExp = /(?:(?<=^|\s)(?:@\w{1,32})(?=$|\s))/g

export function getHashtags(content: Content): string[] | undefined {
  const hashtags = content?.match(hashtagRegExp)
  return hashtags ? parseList(hashtags) : undefined
}

export function getMentions(content: Content): string[] | undefined {
  const mentions = content?.match(mentionRegExp)
  return mentions ? parseList(mentions) : undefined
}

function parseList(list: RegExpMatchArray): string[] {
  // Remove duplicates and first character (# or @)
  return [...new Set(list)].map(item => item.slice(1))
}
