<template>
  <TweetItem
    v-for="tweet in tweets"
    :key="tweet._id"
    :tweet="tweet"
    class="px-3"
  />
</template>

<script setup>
  const { data: tweets } = await useFetch("/api/tweets", { server: false })
</script>
