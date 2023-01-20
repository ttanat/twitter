<template>
  <div class="pt-3 pl-3 pr-3" style="border-bottom: solid 1px grey">
    <div class="d-flex mb-3">
      <NuxtLink :to="'/@'+tweet.user.username" class="user-link mr-3">
        <v-avatar
          :image="tweet.user.image"
          icon="mdi-account"
          color="grey-darken-4"
          size="48"
        ></v-avatar>
      </NuxtLink>
      <NuxtLink :to="'/@'+tweet.user.username" class="user-link">
        <div style="height: 4px"></div>
        <div class="header font-weight-bold underline">{{ tweet.user.name }}</div>
        <div class="header fs-15 text-grey-darken-1">@{{ tweet.user.username }}</div>
      </NuxtLink>
      <v-spacer></v-spacer>
      <v-btn icon density="compact" variant="text" rounded="circle" color="grey" style="margin-top: 4px">
        <v-icon size="24" icon="mdi-dots-horizontal"></v-icon>
      </v-btn>
    </div>
    <div class="content mb-2">{{ tweet.content }}</div>
    <div v-if="tweet.media?.length"><img :src="tweet.media[0]"></div>
    <div class="text-grey-darken-1 my-2 fs-15">{{ useFullTimestamp(tweet.timestamp) }}</div>
    <!-- <div class="divider bg-grey-darken-3"></div> -->
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
    <div class="d-flex my-1 text-grey">
      <v-spacer></v-spacer>
      <v-btn icon variant="text" class="icon-btn reply" style="font-size: 14px">
        <v-icon icon="mdi-chat-outline"></v-icon>
        <v-tooltip activator="parent" location="bottom">Reply</v-tooltip>
      </v-btn>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn icon variant="text" class="icon-btn retweet" style="font-size: 18px">
        <v-icon icon="mdi-repeat-variant"></v-icon>
        <v-tooltip activator="parent" location="bottom">Retweet</v-tooltip>
      </v-btn>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn icon variant="text" class="icon-btn like" style="font-size: 14px">
        <v-icon icon="mdi-heart-outline"></v-icon>
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
  </div>
</template>

<script setup>
const props = defineProps({
  tweet: Object
})

function getNumberTitle(number) {
  return number < 1e4 ? "" : number.toLocaleString()
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
.icon-btn {
  height: 36px;
  width: 36px;
}
.reply:hover {
  color: #299ded;
}
.retweet:hover {
  color: #40a440;
}
.like:hover {
  color: #dc3065;
}
</style>
