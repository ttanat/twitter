<template>
  <v-app-bar height="48" class="px-4">

    <!-- Left -->
    <div class="ml-lg-5">
      <NuxtLink class="text-h6 nav-component pl-lg-5 pl-md-2" id="nav-title" to="/">
        <v-icon icon="mdi-twitter" color="primary"></v-icon>
        <span class="d-none d-lg-block">&ensp;Twitter</span>
      </NuxtLink>
    </div>

    <v-spacer></v-spacer>

    <!-- Center -->
    <div class="font-weight-medium d-none d-md-block">{{ routeName }}</div>
    <v-text-field
      v-model="searchQuery"
      @keyup.enter="search"
      class="mx-5"
      density="compact"
      hide-details
      variant="solo"
      placeholder="Search"
      prepend-inner-icon="mdi-magnify"
      bg-color="#333"
      style="width: 300px"
    ></v-text-field>

    <v-spacer></v-spacer>

    <!-- Right -->
    <div class="nav-right mr-md-2">
      <!-- Menu for logged in users -->
      <HeaderUserMenu v-if="$auth.loggedIn()" />
      <!-- Login and signup buttons -->
      <template v-else>
        <HeaderLoginModal />
        <HeaderSignUpModal />
      </template>
    </div>

  </v-app-bar>
</template>

<script setup>
const routeName = useState("navBarRoute")
const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.path === "/search" ? route.query.q : "")
function search() {
  const q = searchQuery.value
  if (!q || (route.path === "/search" && q === route.query.q)) {
    return false
  }
  router.push({
    path: "/search",
    query: { q },
  })
}
</script>

<style scoped>
.v-col {
  padding: unset;
}
#nav-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  text-decoration: none;
  color: inherit;
}
.nav-component {
  height: 36px;
}
.nav-right {
  display: flex;
  justify-content: flex-end;
}
.mid-col {
  border-left: solid 1px grey;
  border-right: solid 1px grey;
}
</style>
