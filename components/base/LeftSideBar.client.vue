<template>
  <div class="d-none d-sm-block mt-1" style="position: sticky;top: 48px">
    <!-- Screen size lg and above -->
    <!-- Buttons with icons and text -->
    <div v-for="(link, i) in links" :key="i" class="ml-3 mr-2 d-none d-lg-block">
      <v-btn
        variant="text"
        size="x-large"
        rounded="pill"
        class="left-link px-5"
        :to="link.url"
        :active="false"
      >
        <v-icon start :icon="link.icon" color="primary"></v-icon>
        {{ link.title }}
      </v-btn>
    </div>
    <!-- Tweet button -->
    <div class="mx-2 d-none d-lg-block">
      <v-btn class="mt-3 ml-2 tweet-btn" size="large" color="primary" rounded="pill" block>
        <v-icon start icon="mdi-fountain-pen-tip" class="d-lg-none"></v-icon>
        <span class="d-none d-lg-block font-weight-bold">Tweet</span>
        <TweetModal />
      </v-btn>
    </div>
    <!-- Screen size less than lg -->
    <!-- Buttons with icons -->
    <div class="mx-4 d-lg-none">
      <div v-for="(link, i) in links" :key="i" class="d-flex justify-end mb-1">
        <v-btn variant="text" icon color="grey-lighten-2">
          <v-icon :icon="link.icon"></v-icon>
          <v-tooltip activator="parent" location="right">{{ link.title }}</v-tooltip>
        </v-btn>
        </div>
        <!-- Tweet icon -->
        <div class="d-flex justify-end mt-3">
          <v-btn color="primary" icon rounded="normal">
            <v-icon icon="mdi-feather"></v-icon>
            <v-tooltip activator="parent" location="right">Tweet</v-tooltip>
            <TweetModal />
          </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
const links = ref([
  { title: "Home",  url: "/", icon: "mdi-home" },
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
