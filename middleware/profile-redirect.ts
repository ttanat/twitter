export default defineNuxtRouteMiddleware(to => {
  if (to.params.username === useNuxtApp().$auth.getUsername()) {
    return navigateTo("/profile")
  }
})
