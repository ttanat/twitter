import User from "@/server/models/user"
import bcrypt from "bcrypt"
import { createTokens } from "@/server/utils/createTokens"
import { ci } from "~~/server/utils/collations"
import { checkUsername } from "~~/server/utils/query"

export default eventHandler(async event => {
  const { username, password } = await readBody(event)
  if (!checkUsername(username)) {
    return createError({ statusCode: 400 })
  }
  // Find user in database
  const user = await User.findOne({ username }).select({ _id: 0, username: 1, password: 1 }).exec()
  // Check user found and password correct
  if (user === null || !await bcrypt.compare(password, user.password)) {
    return createError({ statusCode: 404, statusMessage: "Username or password incorrect" })
  }

  // Create new access and refresh tokens
  const { accessToken, refreshToken } = createTokens(username)
  // Update last active and save new refresh token
  await User.updateOne({ username }, {
    lastActive: new Date(),
    $push: { validRefreshTokens: refreshToken },
  }).collation(ci).exec()

  return { accessToken, refreshToken }
})
