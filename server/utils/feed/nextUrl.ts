import { H3Event } from "h3"

export const getNextUrl = (event: H3Event, params: Record<string, string>): string => {
  // Get URL up to "?" and add query parameters from params
  return `${(event.node.req.url)!.match(/^[^?]+/)}?${new URLSearchParams(params).toString()}`
}
