import jwt, { JwtPayload } from "jsonwebtoken"
import User from "@/server/models/user"
import { ci } from "~~/server/utils/collations"

const config = useRuntimeConfig()

export default defineEventHandler(async event => {
  const { refreshToken } = await readBody(event)
  // Verify refresh token
  let username
  try {
    ({ username } = jwt.verify(refreshToken, config.REFRESH_SECRET_KEY) as JwtPayload)
  } catch (err) {
    return createError({ statusCode: 401, statusMessage: "Verification error" })
  }
  // Check if refresh token is valid
  const isValid = await User.findOne(
    { username },
    { _id: 0, validRefreshTokens: { $elemMatch: { $eq: refreshToken }}},
  ).collation(ci).exec()
  // Check if returned array has refresh token
  if (isValid?.validRefreshTokens.length === 1) {
    return createError({ statusCode: 401, statusMessage: "Verification error" })
  }
  // Generate new access token
  const accessToken = jwt.sign({ username }, config.ACCESS_SECRET_KEY, { expiresIn: "1h" })

  return { accessToken }
})
