<template>
  <TweetItem
    v-for="tweet in tweets"
    :key="tweet._id"
    :tweet="tweet"
  />
</template>

<script setup>
  const { data: tweets } = await useFetch("/api/tweets", { server: false })
</script>
