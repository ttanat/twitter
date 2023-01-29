import jwt, { JwtPayload } from "jsonwebtoken"
import User, { ci } from "~~/server/models/user"

export default defineEventHandler(async event => {
  const { refreshToken } = await readBody(event)
  // Get username from token
  const { username } = jwt.decode(refreshToken) as JwtPayload
  // Delete refresh token from database (invalidate)
  await User.updateOne({ username }, { $pull: { validRefreshTokens: refreshToken }})
    .collation(ci)
    .exec()

  return {}
})
