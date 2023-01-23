<template>
  <BaseLayout>
    <TweetStatusItem :tweet="tweet" @handle-like="handleLike" />
    <TweetFeedList :url="`/api/tweets/replies?_id=${route.params._id}&before=${new Date().toISOString()}`" />
  </BaseLayout>
</template>

<script setup>
useState("navBarRoute").value = "Tweet"
const route = useRoute()
const { data: tweet } = await useApiFetch("/api/tweet", { query: { _id: route.params._id }, server: true })

function handleLike() {
  tweet.value.isLiked = !tweet.value.isLiked
  tweet.value.numLikes += tweet.value.isLiked ? 1 : -1
}
</script>
