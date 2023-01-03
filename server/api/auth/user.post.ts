import User from "@/server/models/user"

export default defineEventHandler(async event => {
  const { name, username, password } = await readBody(event)
  try {
    // Create new user
    const user = await User.create({ name, username, password })
    return user
  } catch (err: any) {
    // Duplicate error
    if (err.code === 11000) {
      return createError({ statusCode: 409 })
    }
    return createError({ statusCode: 500 })
  }
})
