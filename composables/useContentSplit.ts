const regex: RegExp = /((?:(?<=^|\s)(?:#[a-zA-Z]\w{0,31})(?=$|\s))|(?:(?<=^|\s)(?:@\w{1,32})(?=$|\s)))/g
const hashtagRegex: RegExp = /^#[a-z]\w{0,31}$/i
const usernameRegex: RegExp = /^@\w{3,32}$/

interface SplitContent {
  type: "hashtag" | "username" | null
  content: string
}

export const useContentSplit = (content: string): SplitContent[] => {
  /*
    Split hashtags and usernames from content
    e.g. ["hello ", "@john"]
    Array will start with non-match and alternate between matches and non-matches
  */
  const parts = (content || "").split(regex)

  return parts.map(part => {
    if (part.match(hashtagRegex)) {
      return { type: "hashtag", content: part }
    } else if (part.match(usernameRegex)) {
      return { type: "username", content: part }
    } else {
      return { type: null, content: part }
    }
  })
}
