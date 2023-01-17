<template>
  <BaseLayout v-if="$auth.loggedIn()">
    <TweetList :url="`/api/tweets/bookmarks?username=${$auth.getUsername()}&page=1`" />
  </BaseLayout>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"]
})
</script>
