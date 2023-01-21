<template>
  <BaseLayout>
    <TweetStatus :tweet="tweet" />
    <TweetList :url="`/api/tweets/replies?_id=${_id}&before=${new Date().toISOString()}`" />
  </BaseLayout>
</template>

<script setup>
useState("navBarRoute").value = "Tweet"
const route = useRoute()
const { _id } = route.params
const { data: tweet } = await useApiFetch("/api/tweet", {
  query: { _id }
})
</script>
