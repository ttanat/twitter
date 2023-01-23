<template>
  <BaseLayout>
    <TweetStatus :tweet="tweet" @handle-like="handleLike" />
    <TweetList :url="`/api/tweets/replies?_id=${_id}&before=${new Date().toISOString()}`" />
  </BaseLayout>
</template>

<script setup>
useState("navBarRoute").value = "Tweet"
const route = useRoute()
const { _id } = route.params
const { data: tweet } = await useApiFetch("/api/tweet", { query: { _id }, server: true })

function handleLike() {
  tweet.value.isLiked = !tweet.value.isLiked
  tweet.value.numLikes += tweet.value.isLiked ? 1 : -1
}
</script>
