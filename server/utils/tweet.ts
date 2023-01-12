type Content = string | undefined

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