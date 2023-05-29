<template>
  <BaseLayout>
    <TweetFeedList url="/api/tweets/explore" />
    <template #right><TrendingList /></template>
  </BaseLayout>
</template>

<script setup>
useHead({ title: "Explore" })
useState("navBarRoute").value = "Explore"
</script>
