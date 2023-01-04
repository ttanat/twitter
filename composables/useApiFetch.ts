export const useApiFetch = async (url: string, options?: any): Promise<any> => {
  // Default options
  options = { ...options, server: options?.server || false, credentials: "omit" }

  const { $auth } = useNuxtApp()
  if ($auth.loggedIn()) {
    // Check valid access token
    if ($auth.accessTokenExpired()) {
      await $auth.refresh()
    }
    // Auth header
    options.headers = options.headers || {}
    options.headers.authorization = `Bearer ${$auth.getAccessToken()}`
  }

  // Make request
  const { data, pending, error, refresh } = await useFetch(url, options)

  return { data, pending, error, refresh }
}
