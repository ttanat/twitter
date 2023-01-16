export default defineNuxtRouteMiddleware(() => {
  if (!useNuxtApp().$auth.loggedIn()) {
    return navigateTo("/")
  }
})
