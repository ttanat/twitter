<template>
  <BaseLayout>
    <TweetFeedList url="/api/tweets/explore" />
  </BaseLayout>
</template>

<script setup>
useHead({ title: "Explore" })
useState("navBarRoute").value = "Explore"
</script>
