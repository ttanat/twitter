<template>
  <div class="pt-2 pb-1 tweet-item">
    <v-timeline
      truncate-line="both"
      align="start"
      density="compact"
      side="end"
    >
      <v-timeline-item
        dot-color="#424242"
        class="pl-2"
        width="100%"
        @click="openTweet"
        style="cursor: pointer"
      >
        <template v-slot:icon>
          <NuxtLink :to="'/@'+tweet.user.username">
            <v-avatar
              :image="tweet.user.image"
              icon="mdi-account"
              size="45"
              :style="[tweet.user.image ? 'margin-top: 6px' : '']"
            ></v-avatar>
          </NuxtLink>
        </template>

        <TweetTopRow :tweet="tweet" />
        <div>{{ tweet.content }}</div>
        <div v-if="tweet.media.length"><img :src="tweet.media[0]"></div>
        <TweetBottomRow :tweet="tweet" @handle-like="$emit('handleLike', tweet._id, !tweet.isLiked)" />
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script setup>
const props = defineProps({
  tweet: Object
})
const emit = defineEmits(["handleLike"])

function openTweet(e) {
  if (e.target.nodeName === "DIV") {
    navigateTo(`/status/${props.tweet._id}`)
  }
}
</script>

<style scoped>
.tweet-item {
  font-size: 15px;
}
.v-timeline-item > :first-child {
  padding-inline-start: 12px !important;
}
</style>
