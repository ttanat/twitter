import User from "@/server/models/user"
import jwt, { JwtPayload } from "jsonwebtoken"

export default defineEventHandler(async event => {
  const { refreshToken } = await readBody(event)
  // Verify refresh token
  const { username } = jwt.decode(refreshToken) as JwtPayload
  // Delete refresh token from database (invalidate)
  await User.updateOne({ username }, { $pull: { validRefreshTokens: refreshToken }})

  return {}
})