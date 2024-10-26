<template>
  <div class="d-flex mt-1 text-grey-darken-1">
    <div class="flex-grow-1">
      <v-btn class="replies no-navigate" prepend-icon="mdi-chat-outline" density="compact" variant="text" rounded="pill">
        {{ useNumber(tweet.numReplies) }}
      </v-btn>
    </div>
    <div class="flex-grow-1">
      <v-btn
        v-if="tweet.isPrivate"
        class="no-navigate"
        density="compact"
        variant="text"
        rounded="pill"
      >
        <v-icon size="18" icon="mdi-lock-outline" class="no-navigate" style="padding-top: 1px"></v-icon>
      </v-btn>
      <v-btn
        v-else
        :loading="retweeting"
        :color="tweet.isRetweeted ? '#40a440' : ''"
        class="retweets no-navigate"
        density="compact"
        variant="text"
        rounded="pill"
        width="30px"
      >
        <v-icon size="24" icon="mdi-repeat-variant" class="no-navigate" style="padding-bottom: 2px"></v-icon>
        <span class="no-navigate" style="font-size: 12px">&ensp;</span>{{ useNumber(tweet.numRetweets) }}
        <TweetRetweetMenu
          :is-retweeted="tweet.isRetweeted"
          :quote="tweet._id"
          @handle-retweet="retweet"
        />
      </v-btn>
    </div>
    <div class="flex-grow-1">
      <v-btn
        @click="like"
        :loading="liking"
        class="likes no-navigate"
        :prepend-icon="tweet.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="tweet.isLiked ? '#dc3065' : ''"
        density="compact"
        variant="text"
        rounded="pill"
      >
        {{ useNumber(tweet.numLikes) }}
      </v-btn>
    </div>
    <div class="flex-grow-1">
      <v-btn class="hamburger replies no-navigate" icon density="compact" variant="text" rounded="circle">
        <v-icon size="24" icon="mdi-dots-horizontal" class="no-navigate"></v-icon>
        <TweetHamburgerMenu :tweet_id="tweet._id" />
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tweet: Object
})
const emit = defineEmits(["handleRetweet", "handleLike"])

const { $auth: auth } = useNuxtApp()

const retweeting = ref(false)
async function retweet() {
  if (!auth.loggedIn()) {
    return false
  }
  retweeting.value = true
  const { error } = await useApiFetch("/api/tweet/retweet", {
    method: props.tweet.isRetweeted ? "DELETE" : "POST",
    query: { _id: props.tweet._id },
  })
  retweeting.value = false
  if (error.value) {
    console.log(error.value)
  } else {
    emit("handleRetweet")
  }
}

const liking = ref(false)
async function like() {
  if (!auth.loggedIn()) {
    return false
  }
  liking.value = true
  const { error } = await useApiFetch("/api/tweet/like", {
    method: props.tweet.isLiked ? "DELETE" : "POST",
    query: { _id: props.tweet._id },
  })
  if (error.value) {
    console.log(error.value)
  } else {
    emit("handleLike")
  }
  liking.value = false
}
</script>

<style scoped>
.v-btn {
  margin-left: -13px;
}
.replies:hover {
  color: #299ded;
}
.retweets:hover {
  color: #40a440;
}
.likes:hover {
  color: #dc3065;
}
</style>
