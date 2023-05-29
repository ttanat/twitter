<template>
  <BaseLayout>
    <div v-if="error || tweet.isDeleted || tweet.isRemoved" class="pa-3" style="border-bottom: solid 1px grey">
      <div class="rounded-lg pa-3" style="background: #0f0f0f;border: solid 1px grey">
        Tweet is unavailable
      </div>
    </div>
    <TweetStatusItem
      v-else
      :tweet="tweet"
      @handle-retweet="handleRetweet"
      @handle-like="handleLike"
      @reply-created="replyCreated"
      @handle-edit="handleEdit"
    />
    <TweetFeedList ref="replyFeed" :url="`/api/tweets/replies?_id=${route.params._id}&before=${new Date().toISOString()}`" />
  </BaseLayout>
</template>

<script setup>
useState("navBarRoute").value = "Tweet"
const route = useRoute()
const { data: tweet, error } = await useApiFetch("/api/tweet", { query: { _id: route.params._id }, server: true })

useHead({
  // Content ~ Name (@username)
  title: tweet.value.isDeleted ? "Deleted tweet" : `${`${tweet.value.content} ~ ` || "~ "}${tweet.value.user.name} (@${tweet.value.user.username})`
})

function handleRetweet() {
  tweet.value.isRetweeted = !tweet.value.isRetweeted
  tweet.value.numRetweets += tweet.value.isRetweeted ? 1 : -1
}

function handleLike() {
  tweet.value.isLiked = !tweet.value.isLiked
  tweet.value.numLikes += tweet.value.isLiked ? 1 : -1
}

const replyFeed = ref(null)
function replyCreated(reply) {
  replyFeed.value.prependFeed(reply)
}

function handleEdit(newContent) {
  tweet.value.content = newContent
}
</script>
