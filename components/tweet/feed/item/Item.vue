<template>
  <div class="pt-2 pb-1 tweet-item">
    <span v-if="tweet.retweetedBy" class="d-flex pointer retweeted-by font-weight-bold mb-1" @click="openTweet">
      <v-icon icon="mdi-repeat-variant" class="mr-1"></v-icon>Retweeted by {{ tweet.retweetedBy }}
    </span>
    <v-timeline
      truncate-line="both"
      align="start"
      density="compact"
      side="end"
    >
      <v-timeline-item
        dot-color="#424242"
        class="pl-2 pointer"
        width="100%"
        @click="openTweet"
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

        <TweetFeedItemTopRow :tweet="tweet" />
        <TweetContent :content="tweet.content" />
        <!-- Quote tweet -->
        <div v-if="tweet.quote && loadingQuote"><v-progress-circular indeterminate></v-progress-circular></div>
        <TweetQuoted v-else-if="tweet.quote" :tweet="tweetToQuote" :link="true" />
        <!-- Media -->
        <div v-if="tweet.media.length"><img :src="tweet.media[0]"></div>
        <!-- Poll -->
        <TweetPoll v-if="tweet.poll" :poll="tweet.poll" :tweet_id="tweet._id" />
        <TweetFeedItemBottomRow
          :tweet="tweet"
          @handle-retweet="$emit('handleRetweet', tweet._id)"
          @handle-like="$emit('handleLike', tweet._id)"
        />
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script setup>
const props = defineProps({
  tweet: Object
})
const emit = defineEmits(["handleRetweet", "handleLike"])

function openTweet(e) {
  /* Don't navigate to status page if element clicked has .no-navigate class */
  let el = e.target
  while (el) {
    if (el?.classList?.contains("no-navigate")) {
      return
    }
    el = el.parentNode
  }
  navigateTo(`/status/${props.tweet._id}`)
}

let tweetToQuote, loadingQuote
if (props.tweet.quote) {
  ({ data: tweetToQuote, pending: loadingQuote } = await useApiFetch("/api/tweet/quote", { query: { _id: props.tweet.quote }}))
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.retweeted-by {
  padding-left: 24px;
  font-size: 14px;
  color: #2c842c;
}
.tweet-item {
  font-size: 15px;
}
.v-timeline-item > :first-child {
  padding-inline-start: 12px !important;
}
</style>
