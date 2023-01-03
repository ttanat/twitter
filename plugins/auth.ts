import jwt from "jsonwebtoken"

interface IUser {
  username: string
  name?: string
  image?: string
}

type User = IUser | null

interface Tokens {
  accessToken: string
  refreshToken: string
}

export default defineNuxtPlugin(_ => {
  const accessToken = useCookie("accessToken", {
    sameSite: true,
    maxAge: 60 * 60, // 1 hour
    httpOnly: true,
  })
  const refreshToken = useCookie("refreshToken", {
    sameSite: true,
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
    httpOnly: true,
  })
  const user = useCookie("user", { sameSite: true })

  return {
    provide: {
      auth: {
        // Logged in or not
        loggedIn: (): Boolean => !!(user.value as User)?.username,
        // User object
        getUser: (): User => (user.value as User),
        setUser: (newUser: User): void => {(user.value as User) = newUser},
        getUsername: (): string|null => (user.value as User)?.username ?? null,
        getName: (): string|null => (user.value as User)?.name ?? null,
        getImage: (): string|null => (user.value as User)?.image ?? null,
        // Access token
        getAccessToken: (): string|null => accessToken.value,
        setAccessToken: (newToken: string): void => {accessToken.value = newToken},
        // Refresh token
        getRefreshToken: (): string|null => refreshToken.value,
        setRefreshToken: (newToken: string): void => {refreshToken.value = newToken},
        // Login
        login: async (tokens: Tokens): Promise<void> => {
          // Set tokens
          accessToken.value = tokens.accessToken
          refreshToken.value = tokens.refreshToken
          // Get username from access token
          let username: string = jwt.decode(accessToken.value, { json: true })?.username
          // Get user data
          const { data } = await useFetch("/api/auth/user", { query: { username }})
          console.assert(username === data.value?.username)
          username = data.value?.username!
          // Use (tmp: any) to get around typescript error
          const tmp: any = { username }
          if (data.value?.name) tmp.name = data.value?.name
          if (data.value?.image) tmp.image = data.value?.image
          // Set new user
          user.value = tmp
        },
        // Logout
        logout: (): void => {
          user.value = null
          accessToken.value = null
          refreshToken.value = null
          window.location.href = "/"
        },
      }
    }
  }
})
