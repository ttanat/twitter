<template>
  <TweetItem
    v-for="tweet in tweets"
    :key="tweet._id"
    :tweet="tweet"
    class="px-3"
    style="border-bottom: solid 1px grey"
  />
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: false,
    default: "/api/tweets"
  }
})
const url = ref(props.url)
const tweets = ref([])

// First load
nextTick(() => {
  getTweets()
})

async function getTweets() {
  if (!url.value) return
  const { data } = await useApiFetch(url.value)
  tweets.value.push(...data.value.results)
  url.value = data.value.next
}
</script>
