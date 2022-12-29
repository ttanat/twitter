<template>
  <div class="nav-right-space pr-2 d-none d-lg-block">
    <div class="text-grey-lighten-1">{{ $auth.getName() }}</div>
    <div class="text-grey-darken-1">@{{ $auth.getUsername() }}</div>
  </div>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-avatar
        v-bind="props"
        :image="$auth.getImage()"
        icon="mdi-account-circle"
        variant="plain"
        density="compact"
        style="cursor: pointer"
        size="36"
      ></v-avatar>
    </template>
    <v-list :items="menuItems" width="200"></v-list>
  </v-menu>
</template>

<script setup>
  const username = useNuxtApp().$auth.getUsername()
  const menuItems = ref([
    { title: "Settings", value: "settings", props: { to: "/settings", prependIcon: "mdi-cog" }},
    { title: "Logout", value: "logout", props: { to: "/logout", prependIcon: "mdi-logout" }},
  ])
  if (username) menuItems.value.unshift({ type: "subheader", title: username })
</script>

<style scoped>
.nav-right-space {
  width: 200px;
  text-align: end;
  cursor: default;
}
.nav-right-space > div {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 18px;
  font-size: .85em;
}
</style>
