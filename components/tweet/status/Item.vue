<template>
  <div class="pt-3 pl-3 pr-3" style="border-bottom: solid 1px grey">
    <div class="d-flex mb-3">
      <!-- Image -->
      <NuxtLink :to="'/@'+tweet.user.username" class="user-link mr-3">
        <v-avatar
          :image="tweet.user.image"
          icon="mdi-account"
          color="grey-darken-4"
          size="48"
        ></v-avatar>
      </NuxtLink>
      <!-- Name and username -->
      <NuxtLink :to="'/@'+tweet.user.username" class="user-link">
        <div style="height: 4px"></div>
        <div class="header font-weight-bold underline">{{ tweet.user.name }}</div>
        <div class="header fs-15 text-grey-darken-1">@{{ tweet.user.username }}</div>
      </NuxtLink>
      <v-spacer></v-spacer>
      <!-- Menu -->
      <v-btn icon density="compact" variant="text" rounded="circle" color="grey" style="margin-top: 4px">
        <v-icon size="24" icon="mdi-dots-horizontal"></v-icon>
      </v-btn>
    </div>
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
  />
</template>

<script setup>
defineProps({
  tweet: Object
})
defineEmits(["handleLike"])

const { $auth } = useNuxtApp()

function getNumberTitle(number) {
  return number < 1e4 ? "" : number.toLocaleString()
}

const replyFormShowing = ref(false)
function showReplyForm() {
  replyFormShowing.value = $auth.loggedIn() ? !replyFormShowing.value : false
}
</script>

<style scoped>
.header {
  height: 20px;
}
.fs-15 {
  font-size: 15px;
}
.user-link {
  color: inherit;
}
.underline:hover {
  text-decoration: underline;
}
.content {
  font-size: 20px;
}
.divider {
  height: 1px;
}
</style>
