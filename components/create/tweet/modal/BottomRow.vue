<template>
  <v-container ref="bottomRow">
    <v-row>
      <v-btn v-if="!isThread" :disabled="firstTweetHasPoll" icon class="ml-4 icon-btn" variant="text" color="primary">
        <v-icon icon="mdi-image-outline"></v-icon>
        <v-tooltip activator="parent" location="bottom">Add media</v-tooltip>
      </v-btn>
      <v-btn v-if="!isThread" @click="$emit(firstTweetHasPoll ? 'removePoll' : 'addPoll', 0)" icon class="ml-3 icon-btn" variant="text" color="primary">
        <v-icon :icon="firstTweetHasPoll ? 'mdi-close' : 'mdi-poll'"></v-icon>
        <v-tooltip activator="parent" location="bottom">{{ firstTweetHasPoll ? "Remove" : "Add" }} poll</v-tooltip>
      </v-btn>
      <v-btn icon class="ml-3 icon-btn" variant="text" color="primary">
        <v-icon icon="mdi-calendar-clock-outline"></v-icon>
        <v-tooltip activator="parent" location="bottom">Schedule tweet{{ isThread ? "s" : "" }}</v-tooltip>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="addToThread" :disabled="thread.length >= 10" icon color="grey-darken-3" class="mr-2 icon-btn">
        <v-icon icon="mdi-plus"></v-icon>
        <v-tooltip v-if="!isThread" activator="parent" location="bottom">Add thread</v-tooltip>
      </v-btn>
      <v-btn @click="$emit('tweet')" color="primary" class="mr-2" rounded="pill" :loading="loading">Tweet</v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  thread: Array,
  isThread: Boolean,
  loading: Boolean,
})
const emit = defineEmits(["addToThread", "addPoll", "removePoll", "tweet"])

const firstTweetHasPoll = computed(() => {
  const { poll } = props.thread[0]
  if (!poll) return false
  const { choices, length } = poll
  return choices?.length > 1 && !!length
})

const bottomRow = ref(null)
async function addToThread() {
  emit("addToThread")
  await nextTick()
  bottomRow.value.$el.scrollIntoView({ behavior: "smooth" })
}
</script>

<style scoped>
.icon-btn {
  height: 36px;
  width: 36px;
}
</style>
