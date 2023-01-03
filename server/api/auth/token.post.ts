import User from "@/server/models/user"
import jwt from "jsonwebtoken"

const config = useRuntimeConfig()

export default eventHandler(async event => {
  const { username, password } = await readBody(event)
  // Find user in database
  const user = await User
    .findOneAndUpdate({ username, password }, { lastActive: new Date() })
    .select({ username: 1, _id: 0 })
    .exec()

  if (user === null) {
    return createError({ statusCode: 404, statusMessage: "Username or password incorrect" })
  }

  // Create new access and refresh tokens
  const accessToken = jwt.sign({ username }, config.ACCESS_SECRET_KEY, { expiresIn: "1h" })
  const refreshToken = jwt.sign({ username }, config.REFRESH_SECRET_KEY, { expiresIn: "10y" })

  return { accessToken, refreshToken }
})
