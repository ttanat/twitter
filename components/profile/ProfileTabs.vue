<template>
  <v-tabs v-model="tab" align-tabs="center" grow color="primary" slider-color="primary">
    <v-tab value="1">Tweets</v-tab>
    <v-tab value="2">Replies</v-tab>
    <v-tab value="3">Media</v-tab>
    <v-tab value="4">Likes</v-tab>
  </v-tabs>
  <div style="height: 1px;background: grey"></div>
  <v-window v-model="tab">
    <v-window-item value="1">
      <TweetFeedList :url="`/api/tweets/user?username=${username}&before=${new Date().toISOString()}`" />
    </v-window-item>
    <v-window-item value="2">
      <TweetFeedList :url="`/api/tweets/user-replies?username=${username}&before=${new Date().toISOString()}`" />
    </v-window-item>
    <v-window-item value="3">
      <TweetFeedList />
    </v-window-item>
    <v-window-item value="4">
      <TweetFeedList :url="`/api/tweets/likes?username=${username}&before=${new Date().toISOString()}`" />
    </v-window-item>
  </v-window>
</template>

<script setup>
const tab = ref(null)
const route = useRoute()
const username = computed(() => route.params.username || useNuxtApp().$auth.getUsername())
</script>
