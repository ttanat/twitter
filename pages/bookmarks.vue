<template>
  <BaseLayout v-if="$auth.loggedIn()">
    <TweetFeedList :url="`/api/tweets/bookmarks?username=${$auth.getUsername()}&before=${new Date().toISOString()}`" />
  </BaseLayout>
</template>

<script setup>
definePageMeta({ middleware: ["auth"] })
useHead({ title: "Bookmarks" })
useState("navBarRoute").value = "Bookmarks"
</script>
