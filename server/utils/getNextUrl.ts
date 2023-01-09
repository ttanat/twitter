import { H3Event } from "h3"

export const getNextUrl = (event: H3Event, params: Record<string, string>): string => {
  return `${event.node.req.url}?${new URLSearchParams(params).toString()}`
}
