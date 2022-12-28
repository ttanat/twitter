<template>
  <v-app-bar height="48" color="grey-darken-4 px-5">
    <!-- Left -->
    <NuxtLink class="text-h6 nav-component ml-5" id="nav-title" to="/">
      <v-icon icon="mdi-twitter" color="primary"></v-icon>&nbsp;
      Twitter
    </NuxtLink>

    <v-spacer></v-spacer>

    <!-- Center -->
    <div class="mr-5 font-weight-medium">{{ useRoute().name }}</div>
    <v-text-field
      density="compact"
      hide-details
      variant="solo"
      placeholder="Search"
      prepend-inner-icon="mdi-magnify"
      bg-color="grey-darken-3"
      style="width: 300px"
    ></v-text-field>

    <v-spacer></v-spacer>

    <!-- Right -->
    <div class="nav-right mr-2">
      <v-avatar
        v-if="$auth.loggedIn()"
        :image="$auth.getImage()||''"
        icon="mdi-account-circle"
      ></v-avatar>
      <template v-else>
        <HeaderLoginModal />
        <HeaderSignUpModal />
      </template>
    </div>
  </v-app-bar>
</template>

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
  justify-content: end;
  width: 250px;
}
.mid-col {
  border-left: solid 1px grey;
  border-right: solid 1px grey;
}
</style>
