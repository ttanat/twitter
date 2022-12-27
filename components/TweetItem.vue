<template>
  <div>
    <div>{{ tweet.user.username }}</div>
    <div>{{ tweet.content }}</div>
    <div v-if="tweet.media"><img :src="tweet.media[0]"></div>
  </div>
</template>

<script setup>
  defineProps({
    tweet: Object
  })
</script>
