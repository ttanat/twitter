<template>
  <div
    v-for="(link, i) in links"
    :key="i"
    class="mx-2"
  >
    <v-btn
      variant="text"
      size="x-large"
      rounded="pill"
      class="left-link"
      :to="link.url"
    >
      <v-icon
        start
        :icon="link.icon"
        color="primary"
      ></v-icon>
      {{ link.title }}
    </v-btn>
  </div>
  <div class="mx-2">
    <v-btn
      class="mt-3 ml-2 tweet-btn"
      size="large"
      color="primary"
      rounded="pill"
      block
    >
      Tweet
    </v-btn>
  </div>
</template>

<script setup>
  const links = ref([
    { title: "Explore",  url: "/explore", icon: "mdi-pound" },
    { title: "Notifications", url: "/notifications", icon: "mdi-bell" },
    { title: "Messages", url: "/messages", icon: "mdi-email" },
    { title: "Bookmarks", url: "/bookmarks", icon: "mdi-bookmark" },
    { title: "Profile", url: "/profile", icon: "mdi-account" },
    { title: "Settings", url: "/settings", icon: "mdi-cog" },
  ])
</script>

<style scoped>
.left-link {
  justify-content: start;
}
.left-link, .tweet-btn {
  text-transform: unset;
}
</style>
