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
  <div v-show="url !== null" id="loading" class="pa-5" style="text-align: center">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
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

const io = ref(null)

onMounted(() => {
  io.value = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !!url.value) {
        getTweets()
      } else if (url.value === null) {
        observer.unobserve(entry.target)
      }
    })
  })

  io.value.observe(document.querySelector("#loading"))
})

async function getTweets() {
  if (!url.value) return
  // Use tmp and set url to <empty string> incase getTweets() is called multiple times
  const tmp = url.value
  url.value = ""
  const { data } = await useApiFetch(tmp)
  tweets.value.push(...data.value.results)
  url.value = data.value.next ?? null
}

function handleRetweet(_id) {
  for (const tweet of tweets.value) {
    if (tweet._id === _id) {
      const newValue = !tweet.isRetweeted
      tweet.isRetweeted = newValue
      tweet.numRetweets += newValue ? 1 : -1
    }
  }
}

function handleLike(_id) {
  for (const tweet of tweets.value) {
    if (tweet._id === _id) {
      const newValue = !tweet.isLiked
      tweet.isLiked = newValue
      tweet.numLikes += newValue ? 1 : -1
    }
  }
}

function prependFeed(tweet) {
  tweets.value.unshift(tweet)
}
defineExpose({ prependFeed })
</script>
