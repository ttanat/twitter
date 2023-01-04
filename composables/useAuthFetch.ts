interface Route {
  url: string
  methods: Array<string>
}

const validRoutes: ReadonlyArray<Route> = [
  { url: "/api/auth/token", methods: ["POST"] },
  { url: "/api/auth/user", methods: ["GET", "POST"] },
  { url: "/api/auth/refresh", methods: ["POST"] },
  { url: "/api/auth/logout", methods: ["POST"] },
]

export const useAuthFetch = async (url: string, options?: any): Promise<any> => {
  // Default options
  options = { method: "GET", ...options, server: false }

  // Check valid URL and method
  const route = validRoutes.find(r => r.url === url)
  if (!route?.methods?.includes(options.method)) return

  // Make request
  const { data, pending, error, refresh } = await useFetch(url, options)

  return { data, pending, error, refresh }
}
