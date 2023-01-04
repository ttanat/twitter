export const useApiFetch = async (url: string, options?: any): Promise<any> => {
  // Default options
  options = { ...options, server: options?.server || false, credentials: "omit" }

  // Auth header
  const { $auth } = useNuxtApp()
  if ($auth.loggedIn()) {
    options.headers = options.headers || {}
    options.headers.authorization = `Bearer ${$auth.getAccessToken()}`
  }

  // Make request
  const { data, pending, error, refresh } = await useFetch(url, options)

  return { data, pending, error, refresh }
}
