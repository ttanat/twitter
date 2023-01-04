<template>
  <TweetItem
    v-for="(tweet, i) in tweets"
    :key="tweet._id"
    :tweet="tweet"
    class="px-3"
    :style="[i === 0 ? '' : 'border-top: solid 1px grey']"
  />
</template>

<script setup>
const { data: tweets } = await useApiFetch("/api/tweets")
</script>
