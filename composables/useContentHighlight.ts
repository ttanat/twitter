/*
  (start of string or whitespace -> one hashtag -> end of string or whitespace) OR
  (start of string or whitespace -> one username -> end of string or whitespace)
*/
const regex: RegExp = /(?:(?<=^|\s)(?:#[a-zA-Z]\w{0,31})(?=$|\s))|(?:(?<=^|\s)(?:@\w{1,32})(?=$|\s))/g

export const useContentHighlight = (content: string): string[] => {
  const matches = content.match(regex)
  return [...(matches ?? [])]
}
