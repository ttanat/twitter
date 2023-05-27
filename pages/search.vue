<template>
  <BaseLayout>
    <TweetFeedList :url="url" :key="keyForRefreshingComponent" />
  </BaseLayout>
</template>

<script setup>
useHead({ title: "Search" })
useState("navBarRoute").value = "Search"

const route = useRoute()

function getNewURL() {
  return `/api/tweets/search?q=${route.query.q}&before=${new Date().toISOString()}`
}

const url = ref(getNewURL())

const keyForRefreshingComponent = ref(0)
watch(() => route.query, () => {
  keyForRefreshingComponent.value += 1
  url.value = getNewURL()
})
</script>
