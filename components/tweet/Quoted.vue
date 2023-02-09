<template>
  <div
    @click="openTweet"
    class="quote rounded-lg w-100 px-2 py-1 mt-1"
    :style="[link ? 'cursor: pointer' : '']"
  >
    <div class="d-flex">
      <NuxtLink :to="link ? '/@'+tweet.user.username : ''">
        <v-avatar
          :image="tweet.user.image"
          icon="mdi-account-circle"
          density="compact"
          rounded="circle"
          size="20"
          class="align-self-center mr-1"
        ></v-avatar>
        <span class="top-row-link text-grey-lighten-1 font-weight-bold">
          {{ tweet.user.name }}
        </span>
        <span class="top-row-link text-grey-darken-1">
          <span>&ensp;@{{ tweet.user.username }}</span>
        </span>
      </NuxtLink>
      <v-spacer></v-spacer>
      <span class="text-grey-darken-1">{{ useTimestamp(tweet.timestamp) }}</span>
    </div>
    <TweetContent :content="tweet.content" />
  </div>
</template>

<script setup>
const props = defineProps({
  tweet: Object,
  link: {
    default: true,
    required: false,
  },
})

function openTweet() {
  if (props.link) {
    navigateTo(`/status/${props.tweet._id}`)
  }
}
</script>

<style scoped>
.quote {
  border: solid 1px grey;
}
a {
  color: inherit;
}
</style>
