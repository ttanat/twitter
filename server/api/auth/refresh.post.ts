import jwt, { JwtPayload } from "jsonwebtoken"

const config = useRuntimeConfig()

export default defineEventHandler(async event => {
  const { refreshToken } = await readBody(event)
  // Verify refresh token
  let username
  try {
    username = (jwt.verify(refreshToken, config.REFRESH_SECRET_KEY) as JwtPayload).username
  } catch (err) {
    return createError({ statusCode: 500, statusMessage: "Verification error"})
  }
  // Generate new access token
  const accessToken = jwt.sign({ username }, config.ACCESS_SECRET_KEY, { expiresIn: "1h" })

  return { accessToken }
})
