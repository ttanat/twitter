<template>
  <div class="d-flex my-1 text-grey">
    <v-spacer></v-spacer>
    <v-btn @click="$emit('handleReply')" icon variant="text" class="icon-btn reply" style="font-size: 14px">
      <v-icon :icon="replyFormShowing ? 'mdi-chat' : 'mdi-chat-outline'"></v-icon>
      <v-tooltip activator="parent" location="bottom">Reply</v-tooltip>
    </v-btn>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-btn @click="retweet" :loading="retweeting" icon variant="text" class="icon-btn retweet" style="font-size: 18px">
      <v-icon icon="mdi-repeat-variant" :color="tweet.isRetweeted ? '#40a440' : ''"></v-icon>
      <v-tooltip activator="parent" location="bottom">Retweet</v-tooltip>
    </v-btn>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-btn @click="like" :loading="liking" icon variant="text" class="icon-btn like" style="font-size: 14px">
      <v-icon
        :icon="tweet.isLiked? 'mdi-heart' : 'mdi-heart-outline'"
        :color="tweet.isLiked ? '#dc3065' : ''"
      ></v-icon>
      <v-tooltip activator="parent" location="bottom">Like</v-tooltip>
    </v-btn>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-btn icon variant="text" class="icon-btn reply" style="font-size: 14px">
      <v-icon icon="mdi-export-variant"></v-icon>
      <v-tooltip activator="parent" location="bottom">Share</v-tooltip>
    </v-btn>
    <v-spacer></v-spacer>
  </div>
</template>

<script setup>
const props = defineProps({
  replyFormShowing: Boolean,
  tweet: Object,
})
const emit = defineEmits(["handleReply", "handleRetweet", "handleLike"])

const route = useRoute()
const { $auth: auth } = useNuxtApp()

const retweeting = ref(false)
async function retweet() {
  if (!auth.loggedIn()) {
    return false
  }
  retweeting.value = true
  const options = props.tweet.isRetweeted ? { method: "DELETE", query: { _id: route.params._id }}
                                          : { method: "POST", body: { _id: route.params._id }}
  const { error } = await useApiFetch("/api/tweet/retweet", options)
  retweeting.value = false
  if (error?.value) {
    console.log(error.value)
  } else {
    emit("handleRetweet")
  }
}

const liking = ref(false)
function like() {
  if (!auth.loggedIn()) {
    return false
  }
  liking.value = true
  const { error } = useApiFetch("/api/tweet/like", {
    method: props.tweet.isLiked ? "DELETE" : "POST",
    query: { _id: route.params._id },
  })
  if (error) {
    console.log(error)
  } else {
    emit("handleLike")
  }
  liking.value = false
}
</script>

<style scoped>
.icon-btn {
  height: 36px;
  width: 36px;
}
.reply:hover {
  color: #299ded;
}
.like:hover {
  color: #dc3065;
}
</style>
