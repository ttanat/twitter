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

export default defineNuxtPlugin(nuxtApp => {
  const user = useCookie("user",  {
    default: () => null,
    sameSite: true,
    maxAge: 60 * 60 * 24 * 365 * 3, // 3 years
  })
  const accessToken = useCookie("accessToken", {
    default: () => "",
    sameSite: true,
    maxAge: 60 * 60, // 1 hour
  })
  const refreshToken = useCookie("refreshToken", {
    default: () => "",
    sameSite: true,
    maxAge: 60 * 60 * 24 * 365 * 3, // 3 years
  })

  return {
    provide: {
      auth: {
        // Logged in or not
        loggedIn: (): Boolean => !!user.value?.["username"],
        // User object
        getUser: (): User => user.value,
        setUser: (newUser: any/* supposed to be IUser */): void => {user.value = newUser},
        getUsername: (): string|null => user.value?.["username"] ?? null,
        getName: (): string|null => user.value?.["name"] ?? null,
        getImage: (): string => user.value?.["image"] ?? "",
        // Access token
        getAccessToken: (): string|null => accessToken.value,
        setAccessToken: (newToken: string): void => {accessToken.value = newToken},
        // Refresh token
        getRefreshToken: (): string|null => refreshToken.value,
        setRefreshToken: (newToken: string): void => {refreshToken.value = newToken},
        // // Login
        login: async (tokens: Tokens): Promise<void> => {
          // Set tokens
          accessToken.value = tokens.accessToken
          refreshToken.value = tokens.refreshToken
          // Get username from access token
          let username: string = jwt.decode(accessToken.value, { json: true })?.username
          // Get user data
          const { data } = await useFetch("/api/user", { query: { username }})
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
          accessToken.value = ""
          refreshToken.value = ""
        },
      }
    }
  }
})
