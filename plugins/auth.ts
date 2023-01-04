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
        loggedIn: (): Boolean => !!(user.value as User)?.username && !!accessToken.value && !!refreshToken.value,
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
          const username: string = jwt.decode(accessToken.value, { json: true })!.username
          // Get user data
          const { data } = await useAuthFetch("/api/auth/user", { query: { username }})
          console.assert(username === data.value?.username)
          // New user value
          const newUser: IUser = { username }
          if (data.value?.name) newUser.name = data.value?.name
          if (data.value?.image) newUser.image = data.value?.image
          // Set new user
          user.value = newUser as any
        },
        // Logout
        logout: (): void => {
          user.value = null
          accessToken.value = null
          refreshToken.value = null
          window.location.href = "/"
        },
        // Check access token is expired (5s from expiring ≈ expired)
        accessTokenExpired: (): Boolean => {
          // Get access token expiration
          const { exp } = jwt.decode(accessToken.value!, { json: true })!
          // Check if access token is 5s from expiring
          return new Date().getTime() + 5000 > (exp as number) * 1000
        },
        // Refresh
        refresh: async (): Promise<void> => {
          // Make request
          const { data } = await useAuthFetch("/api/auth/refresh", {
            method: "POST",
            body: { refreshToken: refreshToken.value },
          })
          // Set new access token
          accessToken.value = data.value.accessToken
          console.log(accessToken)
          console.log(refreshToken)
        },
      }
    }
  }
})
