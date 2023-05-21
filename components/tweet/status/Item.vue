<template>
  <div class="pt-3 px-3" style="border-bottom: solid 1px grey">
    <!-- Header -->
    <TweetStatusHeader :tweet="tweet" :editing="editing" :canEdit="canEdit" @handle-edit="startEditing" />
    <!-- Edit content -->
    <div v-if="editing">
      <v-textarea
        v-model="editTextarea"
        variant="outlined"
        placeholder="What's happening?"
        single-line
        density="compact"
        counter="300"
        maxlength="300"
        auto-grow
        no-resize
        rows="4"
      ></v-textarea>
      <div class="d-flex flex-row align-center justify-space-between mt-1 mb-3">
        <v-btn @click="editing = false" color="secondary" rounded="pill" class="flex-grow-1">Cancel</v-btn>
        <v-btn @click="handleEdit" :loading="savingEdit" color="primary" rounded="pill" class="flex-grow-1 ml-5">&ensp;&nbsp;Edit&nbsp;&ensp;</v-btn>
      </div>
    </div>
    <!-- Content -->
    <TweetContent :content="tweet.content" class="content mb-2" />
    <!-- Media -->
    <div v-if="tweet.media?.length"><img :src="tweet.media[0]"></div>
    <!-- Poll -->
    <TweetPoll v-if="tweet.poll" :poll="tweet.poll" :tweet_id="tweet._id" />
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
      @handle-retweet="$emit('handleRetweet')"
      @handle-like="$emit('handleLike')"
    />
  </div>
  <TweetStatusReplyForm
    v-if="replyFormShowing"
    :replyToName="tweet.user.name"
    @reply-created="replyCreated"
  />
  <ClientOnly>
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarColor" rounded="pill">{{ snackbarMessage }}</v-snackbar>
  </ClientOnly>
</template>

<script setup>
const props = defineProps({
  tweet: Object
})
const emit = defineEmits(["handleRetweet", "handleLike", "replyCreated", "handleEdit"])

const route = useRoute()

function getNumberTitle(number) {
  return number < 1e4 ? "" : number.toLocaleString()
}

const snackbarTimeout = ref(0)
const snackbarColor = ref("")
const snackbarMessage = ref("")
const snackbar = ref(false)
function showSnackbar(timeout, color, message) {
  snackbarTimeout.value = timeout
  snackbarColor.value = color
  snackbarMessage.value = message
  snackbar.value = true
}

// User can edit tweet within 5 minutes of tweeting and if there are no replies
const canEdit = computed(() => {
  return Date.now() - props.tweet.timestamp.valueOf() > 1000 * 60 * 5 || props.tweet.numReplies > 0
})
const editTextarea = ref(props.tweet.content ?? "")
const editing = ref(false)
function startEditing() {
  editing.value = true
}
const savingEdit = ref(false)
// Validate edit and send to server
async function handleEdit() {
  // Slice and trim
  editTextarea.value = editTextarea.value.slice(0, 300).trim()
  // Check all not empty
  if (!editTextarea.value && !props.tweet.media?.length && !props.tweet.poll?.choices.length) {
    showSnackbar(5000, "warning", "Tweet cannot be empty")
    return false
  }
  // Check still allowed to edit
  if (!canEdit.value) {
    showSnackbar(5000, "warning", "Cannot reply anymore")
    return false
  }
  // If content hasn't changed
  if (editTextarea.value === props.tweet.content) {
    showSnackbar(5000, "success", "Tweet edited")
    editing.value = false
    return false
  }

  savingEdit.value = true
  /*
    Use different route because using same route with different method causes errors
    Tweet prop in parent components are changed to empty string
  */
  const { error } = await useApiFetch("/api/tweet/edit", {
    method: "PUT",
    body: { _id: route.params._id, content: editTextarea.value },
  })
  savingEdit.value = false
  if (error.value) {
    console.log(error.value)
    return false
  }

  showSnackbar(5000, "success", "Tweet edited")
  emit("handleEdit", editTextarea.value)
  editing.value = false
}

const replyFormShowing = ref(false)
function showReplyForm() {
  replyFormShowing.value = useNuxtApp().$auth.loggedIn() ? !replyFormShowing.value : false
}
const replySnackbar = ref(false)
function replyCreated(reply) {
  replyFormShowing.value = false
  replySnackbar.value = true
  showSnackbar(2000, "success", "Replied")
  emit("replyCreated", reply)
}
</script>

<style scoped>
.fs-15 {
  font-size: 15px;
}
.content {
  font-size: 20px;
}
.divider {
  height: 1px;
}
</style>
