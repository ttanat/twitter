<template>
  <div class="pt-3 px-3" style="border-bottom: solid 1px grey">
    <!-- Header -->
    <TweetStatusHeader :tweet="tweet" />
    <!-- Content -->
    <div class="content mb-2">{{ tweet.content }}</div>
    <!-- Media -->
    <div v-if="tweet.media?.length"><img :src="tweet.media[0]"></div>
    <!-- Timestamp -->
    <div class="text-grey-darken-1 my-2 fs-15">{{ useFullTimestamp(tweet.timestamp) }}</div>
    <!-- Tweet stats -->
    <div class="my-2 d-flex">
      <div class="mr-2" :title="getNumberTitle(tweet.numRetweets)">
        <span class="font-weight-bold">{{ useNumber(tweet.numRetweets) }}</span>&nbsp;<span class="text-grey-darken-1">Retweets</span>
      </div>
      <div class="mx-2" :title="getNumberTitle(tweet.numQuotes)">
        <span class="font-weight-bold">{{ useNumber(tweet.numQuotes) }}</span>&nbsp;<span class="text-grey-darken-1">Quotes</span>
      </div>
      <div class="mx-2" :title="getNumberTitle(tweet.numLikes)">
        <span class="font-weight-bold">{{ useNumber(tweet.numLikes) }}</span>&nbsp;<span class="text-grey-darken-1">Likes</span>
      </div>
    </div>
    <div class="divider bg-grey-darken-3"></div>
    <!-- Buttons -->
    <TweetStatusBottomRow
      :replyFormShowing="replyFormShowing"
      :tweet="tweet"
      @handle-reply="showReplyForm"
      @handle-like="$emit('handleLike')"
    />
  </div>
  <TweetStatusReplyForm
    v-if="replyFormShowing"
    :replyToName="tweet.user.name"
    @reply-created="replyCreated"
  />
  <v-snackbar v-model="replySnackbar" :timeout="2000" color="success" rounded="pill">Reply sent</v-snackbar>
</template>

<script setup>
defineProps({
  tweet: Object
})
const emit = defineEmits(["handleLike", "replyCreated"])

function getNumberTitle(number) {
  return number < 1e4 ? "" : number.toLocaleString()
}

const replyFormShowing = ref(false)
function showReplyForm() {
  replyFormShowing.value = useNuxtApp().$auth.loggedIn() ? !replyFormShowing.value : false
}
const replySnackbar = ref(false)
function replyCreated(reply) {
  replyFormShowing.value = false
  replySnackbar.value = true
  emit("replyCreated", reply)
}
</script>

<style scoped>
.fs-15 {
  font-size: 15px;
}
.content {
  font-size: 20px;
}
.divider {
  height: 1px;
}
</style>
