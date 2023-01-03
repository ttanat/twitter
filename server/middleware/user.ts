import jwt from "jsonwebtoken"

const config = useRuntimeConfig()

export default defineEventHandler(event => {
  // Get access token
  const authHeader = getRequestHeader(event, "Authorization")
  if (!authHeader) {
    // Set user to null if not logged in
    event.context.user = null
  } else {
    // Remove "Bearer "
    const accessToken = authHeader.slice(7)
    try {
      // Verify token
      const user = jwt.verify(accessToken, config.ACCESS_SECRET_KEY)
      // Set user
      event.context.user = user
    } catch (err) {
      // Throw error
      return createError({ statusCode: 401, message: "Invalid credentials" })
    }
  }
})
