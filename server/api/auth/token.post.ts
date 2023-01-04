import User from "@/server/models/user"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const config = useRuntimeConfig()

export default eventHandler(async event => {
  const { username, password } = await readBody(event)
  // Find user in database
  const user = await User.findOne({ username }).select({ _id: 0, username: 1, password: 1 }).exec()

  // Check user found and password correct
  if (user === null || !await bcrypt.compare(password, user.password)) {
    return createError({ statusCode: 404, statusMessage: "Username or password incorrect" })
  }

  // Update last active
  await User.updateOne({ username }, { lastActive: new Date() })

  // Create new access and refresh tokens
  const accessToken = jwt.sign({ username }, config.ACCESS_SECRET_KEY, { expiresIn: "1h" })
  const refreshToken = jwt.sign({ username }, config.REFRESH_SECRET_KEY, { expiresIn: "10y" })

  return { accessToken, refreshToken }
})
