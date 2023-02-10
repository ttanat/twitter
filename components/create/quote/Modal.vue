<template>
  <v-dialog
    v-model="dialog"
    activator="parent"
    :width="mobile ? '' : '640'"
    :fullscreen="mobile"
    transition="scale-transition"
    scrim="black"
  >
    <v-card class="pb-2" :style="[mobile ? '' : 'border-radius: 18px']">
      <v-card-text class="text-h6 pb-0 d-flex" style="max-height: 60px">
        Quote Tweet
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" class="icon-btn" variant="text" @click="dialog = false"></v-btn>
      </v-card-text>
      <v-card-text class="pt-2">
        <v-timeline
          truncate-line="both"
          align="start"
          density="compact"
          side="end"
          class="mb-2"
        >
          <v-timeline-item dot-color="#424242" width="100%">
            <template v-slot:icon>
              <v-avatar
                :image="$auth.getImage()"
                icon="mdi-account"
                size="45"
                :style="[$auth.getImage() ? 'margin-top: 6px' : '']"
              ></v-avatar>
            </template>

            <div class="d-flex">
              <span class="top-row-link text-grey-lighten-1 font-weight-bold">
                {{ $auth.getName() }}
              </span>
              <span class="top-row-link text-grey-darken-1">
                <span>&ensp;@{{ $auth.getUsername() }}</span>
              </span>
            </div>
            <v-textarea
              v-model="content"
              @update:model-value="clearMessage"
              variant="outlined"
              :label="label"
              single-line
              density="compact"
              counter="300"
              maxlength="300"
              no-resize
              auto-grow
              rows="4"
            ></v-textarea>
            <div>
              <v-chip
                v-for="h in useContentHighlight(content)"
                :color="h[0] === '#' ? 'primary' : 'success'"
                class="mr-2 mb-2"
              >
                <v-icon start :icon="h[0] === '#' ? 'mdi-pound' : 'mdi-at'"></v-icon>
                {{ h.slice(1) }}
              </v-chip>
            </div>
            <!-- <div v-if="tweet.media.length"><img :src="tweet.media[0]"></div> -->
            <div v-if="pending"><v-progress-circular indeterminate></v-progress-circular></div>
            <!-- Show tweet that user is going to quote -->
            <TweetQuoted v-else :tweet="tweetToQuote" :link="false" />
          </v-timeline-item>
        </v-timeline>
        <div v-show="message.length" class="text-error">{{ message }}</div>
      </v-card-text>
      <v-divider class="mb-2"></v-divider>
      <v-container>
        <v-row>
          <v-btn icon class="ml-4 icon-btn" variant="text" color="primary">
            <v-icon icon="mdi-image-outline"></v-icon>
            <v-tooltip activator="parent" location="bottom">Add media</v-tooltip>
          </v-btn>
          <v-btn icon class="ml-3 icon-btn" variant="text" color="primary">
            <v-icon icon="mdi-poll"></v-icon>
            <v-tooltip activator="parent" location="bottom">Add poll</v-tooltip>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="tweet" color="primary" class="mr-2" rounded="pill" :loading="loading">Quote</v-btn>
        </v-row>
      </v-container>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="2000" color="success" rounded="pill">
      Tweet sent
    </v-snackbar>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps({
  quote: String,
})
const emit = defineEmits(["close"])

const { data: tweetToQuote, pending } = await useApiFetch("/api/tweet/quote", { query: { _id: props.quote }})

const dialog = ref(false)
watch(dialog, (val) => {
  if (!val) {
    emit("close")
  }
})
const { mobile } = useDisplay()

const content = ref("")
const files = ref([])
const poll = ref({})

const label = ref("What's happening?")
label.value = `Quote ${tweetToQuote.value.user.name}...`
const loading = ref(false)
const message = ref("")
function clearMessage() {
  message.value = ""
}
const snackbar = ref(false)

async function tweet() {
  // Slice content
  content.value = content.value.slice(0, 300).trim()
  // Check if empty
  if (!content.value && !files.value.length && !poll.value.choices?.length) {
    message.value = "Tweet can't be empty"
    return
  }
  // Check if media and poll both present
  if (files.value.length && poll.value.choices?.length) {
    message.value = "Can't have media and poll in same tweet"
    return
  }

  // Send to server
  loading.value = true
  const { error } = await useApiFetch("/api/tweet/retweet/quote", {
    method: "POST",
    body: { quote: props.quote, content: content.value },
  })
  loading.value = false
  // Handle response from server
  if (error.value) {
    message.value = "Oops, something went wrong. Please try again."
  } else {
    resetForm()
    snackbar.value = true
    dialog.value = false
  }
}

function resetForm() {
  content.value = ""
  files.value = []
  poll.value = {}
}
</script>

<style scoped>
.v-timeline-item > :first-child {
  padding-inline-start: 12px !important;
}
.icon-btn {
  height: 36px;
  width: 36px;
}
</style>
