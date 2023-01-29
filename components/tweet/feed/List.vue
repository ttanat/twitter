<template>
  <TweetFeedItem
    v-for="tweet in tweets"
    :key="tweet._id"
    :tweet="tweet"
    class="px-3"
    style="border-bottom: solid 1px grey"
    @handle-like="handleLike"
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

function handleLike(_id, newValue) {
  const tweet = tweets.value.find(tweet => tweet._id === _id)
  tweet.isLiked = newValue
  tweet.numLikes += newValue ? 1 : -1
}

function prependFeed(tweet) {
  tweets.value.unshift(tweet)
}
defineExpose({ prependFeed })
</script>
