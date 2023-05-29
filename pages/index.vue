<template>
  <BaseLayout>
    <TweetFeedList :url="url" />
    <template #right><TrendingList /></template>
  </BaseLayout>
</template>

<script setup>
useHead({ title: "Home" })
useState("navBarRoute").value = "Home"

const { $auth: auth } = useNuxtApp()

const url = ref(auth.loggedIn() ? `/api/tweets?before=${new Date().toISOString()}` : "/api/tweets/explore")
</script>
