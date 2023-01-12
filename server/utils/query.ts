import { QueryValue } from "ufo"

const usernameRegExp = /^\w{3,32}$/

export const checkUsername = (username: QueryValue | QueryValue[]): boolean => {
  const str = username?.toString() ?? ""
  return str.match(usernameRegExp)?.length === 1 && typeof username === "string"
}

export const checkDateString = (date: QueryValue | QueryValue[]): boolean => {
  return !Number.isNaN(Date.parse(date?.toString() ?? ""))
}

export const checkPageNumber = (page: number | QueryValue | QueryValue[]): boolean => {
  let p = -0.1
  if (typeof page === "string") {
    p = parseFloat(page)
  } else if (typeof page === "number") {
    p = page
  }
  return Number.isInteger(p) && p > 0
}
