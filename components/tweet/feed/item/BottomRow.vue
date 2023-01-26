<template>
  <div class="d-flex mt-1 text-grey-darken-1">
    <div class="flex-grow-1">
      <v-btn class="replies" prepend-icon="mdi-chat-outline" density="compact" variant="text" rounded="pill">
        {{ useNumber(tweet.numReplies) }}
      </v-btn>
    </div>
    <div class="flex-grow-1">
      <v-btn class="retweets" density="compact" variant="text" rounded="pill" width="30px">
        <v-icon size="24" icon="mdi-repeat-variant" style="padding-bottom: 2px"></v-icon>
        <span style="font-size: 12px">&ensp;</span>{{ useNumber(tweet.numRetweets) }}
      </v-btn>
    </div>
    <div class="flex-grow-1">
      <v-btn
        @click="like"
        :loading="liking"
        class="likes"
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
      <v-btn class="hamburger replies" icon density="compact" variant="text" rounded="circle">
        <v-icon size="24" icon="mdi-dots-horizontal"></v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tweet: Object
})
const emit = defineEmits(["handleLike"])

const { $auth } = useNuxtApp()

const liking = ref(false)
async function like() {
  if (!$auth.loggedIn()) {
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
