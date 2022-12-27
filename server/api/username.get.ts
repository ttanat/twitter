import User from "@/server/models/user"

export default defineEventHandler(async event => {
  console.log(new Date())
  const { username } = getQuery(event)
  // Check valid characters
  if (!username?.toString().match(/^\w{3,32}$/)) {
    return createError({ statusCode: 400, stack: "" })
  }
  // Check if username exists in database
  const user = await User.findOne({ username }).exec()
  console.log(user)
  // If user already exists
  if (user) {
    return createError({ statusCode: 409, stack: "" })
  }
  // If user doesn't exist, return 2xx response
  return null
})
