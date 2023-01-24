<template>
  <div class="pt-2 pb-1 px-3 tweet-item" style="border-bottom: solid 1px grey">
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
      >
        <template v-slot:icon>
          <v-avatar
            :image="$auth.getImage()"
            icon="mdi-account"
            size="45"
            :style="[$auth.getImage() ? 'margin-top: 6px' : '']"
          ></v-avatar>
        </template>
        
        <span class="top-row-link text-grey-lighten-1 font-weight-bold">
          {{ $auth.getName() }}
        </span>
        <span class="top-row-link text-grey-darken-1">
          <span>&ensp;@{{ $auth.getUsername() }}</span>
        </span>
        <v-textarea
          v-model="content"
          @update:model-value="clearMessage"
          variant="outlined"
          :label="`Reply to ${replyToName}...`"
          single-line
          density="compact"
          counter="300"
          maxlength="300"
          no-resize
          auto-grow
          rows="3"
          class="mt-1"
        ></v-textarea>
        <!-- <div v-if="tweet.media.length"><img :src="tweet.media[0]"></div> -->
        <div v-show="message.length" class="text-error">{{ message }}</div>
      </v-timeline-item>
    </v-timeline>
    <v-container ref="bottomRow">
      <v-row>
        <v-btn icon class="icon-btn" variant="text" color="primary">
          <v-icon icon="mdi-image-outline"></v-icon>
          <v-tooltip activator="parent" location="top">Add media</v-tooltip>
        </v-btn>
        <v-btn icon class="ml-2 icon-btn" variant="text" color="primary">
          <v-icon icon="mdi-poll"></v-icon>
          <v-tooltip activator="parent" location="top">Add poll</v-tooltip>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="reply" color="primary" class="mr-2" rounded="pill" :loading="loading">Reply</v-btn>
      </v-row>
    </v-container>
  </div>
  <v-snackbar
    v-model="snackbar"
    :timeout="2000"
    color="success"
    rounded="pill"
  >
    Reply sent
  </v-snackbar>
</template>

<script setup>
defineProps({
  replyToName: String
})
const route = useRoute()

const content = ref("")
const loading = ref(false)
const message = ref("")
function clearMessage() {
  message.value = ""
}
const snackbar = ref(false)

function reply() {
  content.value = content.value.slice(0, 300).trim()
  if (!content.value) {
    return false
  }
  // Send to server
  loading.value = true
  const { data, error } = useApiFetch("/api/tweet/reply", {
    method: "POST",
    body: { replyTo: route.params._id, content: content.value },
  })
  loading.value = false
  // Handle response from server
  if (error) {
    message.value = "Oops, something went wrong. Please try again."
  } else {
    resetForm()
    snackbar.value = true
  }
}

function resetForm() {
  content.value = ""
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
