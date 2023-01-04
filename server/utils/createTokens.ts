import jwt from "jsonwebtoken"

interface Tokens {
  accessToken: string
  refreshToken: string
}

const config = useRuntimeConfig()

export const createTokens = (username: string): Tokens => {
  // Create new access and refresh tokens
  const accessToken = jwt.sign({ username }, config.ACCESS_SECRET_KEY, { expiresIn: "1h" })
  const refreshToken = jwt.sign({ username }, config.REFRESH_SECRET_KEY, { expiresIn: "10y" })

  return { accessToken, refreshToken }
}
