<template>
  <BaseLayout>
    <TweetFeedList />
  </BaseLayout>
</template>

<script setup>
useHead({ title: "Home" })
useState("navBarRoute").value = "Home"
</script>
