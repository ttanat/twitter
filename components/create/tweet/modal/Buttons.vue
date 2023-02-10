<template>
  <div v-if="!tweet.media?.length && !tweet.poll?.choices?.length">
    <v-btn icon class="icon-btn mr-4" variant="text" color="primary">
      <v-icon icon="mdi-image-outline"></v-icon>
      <v-tooltip activator="parent" location="right">Add media</v-tooltip>
    </v-btn>
    <v-btn @click="$emit('addPoll', tweetNumber)" icon class="icon-btn" variant="text" color="primary">
      <v-icon icon="mdi-poll"></v-icon>
      <v-tooltip activator="parent" location="right">Add poll</v-tooltip>
    </v-btn>
  </div>
  <div v-else-if="tweet?.poll?.choices?.length > 1" class="d-flex">
    <v-btn :disabled="tweet.poll.choices.length >= 6" @click="$emit('addPollChoice', tweetNumber)" icon color="grey-darken-3" class="icon-btn mr-4">
      <v-icon icon="mdi-plus"></v-icon>
      <v-tooltip activator="parent" location="right">Add choice</v-tooltip>
    </v-btn>
    <v-btn @click="$emit('removePoll', tweetNumber)" icon color="grey-darken-3" class="icon-btn">
      <v-icon icon="mdi-close"></v-icon>
      <v-tooltip activator="parent" location="right">Remove poll</v-tooltip>
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  tweet: Object,
  tweetNumber: Number,
})
const emit = defineEmits(["addPoll", "addPollChoice", "removePoll"])
</script>

<style scoped>
.icon-btn {
  height: 36px;
  width: 36px;
}
</style>
