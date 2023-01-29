<template>
  <TweetFeedItem
    v-for="tweet in tweets"
    :key="tweet._id"
    :tweet="tweet"
    class="px-3"
    style="border-bottom: solid 1px grey"
    @handle-retweet="handleRetweet"
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

function findTweet(_id) {
  return tweets.value.find(tweet => tweet._id === _id)
}

function handleRetweet(_id) {
  const tweet = findTweet(_id)
  const newValue = !tweet.isRetweeted
  tweet.isRetweeted = newValue
  tweet.numRetweets += newValue ? 1 : -1
}

function handleLike(_id) {
  const tweet = findTweet(_id)
  const newValue = !tweet.isLiked
  tweet.isLiked = newValue
  tweet.numLikes += newValue ? 1 : -1
}

function prependFeed(tweet) {
  tweets.value.unshift(tweet)
}
defineExpose({ prependFeed })
</script>
