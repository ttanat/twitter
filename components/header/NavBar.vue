<template>
  <ClientOnly>
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
      <div class="mr-5 font-weight-medium d-none d-md-block">{{ useRoute().name }}</div>
      <v-text-field
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
      <div v-if="$auth.loggedIn()" class="nav-right-space pr-2 d-none d-lg-block">
        <div class="text-grey-lighten-1">{{ $auth.getName() }}</div>
        <div class="text-grey-darken-1">@{{ $auth.getUsername() }}</div>
      </div>
      <div class="nav-right mr-md-2">
        <!-- Menu for logged in users -->
        <v-menu v-if="$auth.loggedIn()">
          <template v-slot:activator="{ props }">
            <v-avatar
              v-bind="props"
              :image="$auth.getImage()||''"
              icon="mdi-account-circle"
              variant="plain"
              density="compact"
              style="cursor: pointer"
              size="36"
            ></v-avatar>
          </template>
          <v-list :items="menuItems" width="200"></v-list>
        </v-menu>
        <!-- Login and signup buttons -->
        <template v-else>
          <HeaderLoginModal />
          <HeaderSignUpModal />
        </template>
      </div>
    </v-app-bar>
  </ClientOnly>
</template>

<script setup>
  const menuItems = ref([
    { type: "subheader", title: `@${useNuxtApp().$auth.getUsername()}` || "" },
    { title: "Settings", value: "settings", props: { to: "/settings", prependIcon: "mdi-cog" }},
    { title: "Logout", value: "logout", props: { to: "/logout", prependIcon: "mdi-logout" }},
  ])
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
.nav-right-space {
  width: 200px;
  text-align: end;
}
.nav-right-space > div {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 18px;
  font-size: .85em;
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
