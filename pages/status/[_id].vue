<template>
  <BaseLayout>
    <TweetStatus :tweet="data" />
  </BaseLayout>
</template>

<script setup>
const route = useRoute()
const { data } = await useApiFetch("/api/tweet", {
  query: { _id: route.params._id }
})
</script>
