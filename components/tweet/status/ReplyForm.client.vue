<template>
  <div class="py-2 px-3 tweet-item" style="border-bottom: solid 1px grey">
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
      </v-timeline-item>
    </v-timeline>
    <div v-show="message.length" class="text-error pl-2">{{ message }}</div>
    <div class="d-flex">
      <v-btn icon class="icon-btn" variant="text" color="primary">
        <v-icon icon="mdi-image-outline"></v-icon>
        <v-tooltip activator="parent" location="top">Add media</v-tooltip>
      </v-btn>
      <v-btn icon class="ml-2 icon-btn" variant="text" color="primary">
        <v-icon icon="mdi-poll"></v-icon>
        <v-tooltip activator="parent" location="top">Add poll</v-tooltip>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="reply" color="primary" rounded="pill" class="align-self-center" :loading="loading">Reply</v-btn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  replyToName: String
})
const emit = defineEmits(["replyCreated"])

const route = useRoute()

const content = ref("")
const loading = ref(false)
const message = ref("")
function clearMessage() {
  message.value = ""
}

async function reply() {
  content.value = content.value.slice(0, 300).trim()
  if (!content.value) {
    message.value = "Reply can't be empty"
    return false
  }
  // Send to server
  loading.value = true
  const { data } = await useApiFetch("/api/tweet/reply", {
    method: "POST",
    body: { replyTo: route.params._id, content: content.value },
  })
  loading.value = false
  // Handle response from server
  if (data) {
    emit("replyCreated", data.value)
    resetForm()
  } else {
    message.value = "Oops, something went wrong. Please try again."
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
