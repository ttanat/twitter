import User from "@/server/models/user"
import bcrypt from "bcrypt"
import { createTokens } from "@/server/utils/createTokens"

const saltRounds = 10

export default defineEventHandler(async event => {
  const { name, username, password } = await readBody(event)
  // Hash password
  const hash = await bcrypt.hash(password, saltRounds)
  try {
    // Create new user
    const user = await User.create({ name, username, password: hash })
    // Create new access and refresh tokens
    const { accessToken, refreshToken } = createTokens(user.username)
    // Save new refresh token
    await User.updateOne({ username }, { $push: { validRefreshTokens: refreshToken }}).exec()

    return { accessToken, refreshToken }
  } catch (err: any) {
    // Duplicate error
    if (err.code === 11000) {
      return createError({ statusCode: 409 })
    }
    return createError({ statusCode: 500 })
  }
})
