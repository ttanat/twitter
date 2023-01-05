import User from "@/server/models/user"
import bcrypt from "bcrypt"
import { createTokens } from "@/server/utils/createTokens"

export default eventHandler(async event => {
  const { username, password } = await readBody(event)
  // Find user in database
  const user = await User.findOne({ username }).select({ _id: 0, username: 1, password: 1 }).exec()
  // Check user found and password correct
  if (user === null || !await bcrypt.compare(password, user.password)) {
    return createError({ statusCode: 404, statusMessage: "Username or password incorrect" })
  }

  // Create new access and refresh tokens
  const { accessToken, refreshToken } = createTokens(username)
  console.log(refreshToken)
  // Update last active and save new refresh token
  await User.updateOne({ username }, {
    lastActive: new Date(),
    $push: { validRefreshTokens: refreshToken },
  })

  return { accessToken, refreshToken }
})
