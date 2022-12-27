import User from "@/server/models/user"

export default eventHandler(async event => {
  const { username, password } = getQuery(event)
  const user = await User.findOne({ username, password }).exec()

  if (user === null) {
    return createError({ statusCode: 404, statusMessage: "Username or password incorrect" })
  }
  return user
})
