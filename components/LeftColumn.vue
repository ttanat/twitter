<template>
  <div
    v-for="(link, i) in links"
    :key="i"
    class="mx-2"
  >
    <v-btn
      variant="text"
      size="large"
      block
      class="left-link"
      :to="link.url"
    >
      {{ link.title }}
    </v-btn>
  </div>
  <div class="mx-2">
    <v-btn
      class="mt-3 tweet-btn"
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
    { title: "Explore",  url: "/explore" },
    { title: "Notifications", url: "/notifications" },
    { title: "Messages", url: "/messages" },
    { title: "Bookmarks", url: "/bookmarks" },
    { title: "Profile", url: "/profile" },
    { title: "Settings", url: "/settings" },
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
