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
        Tweet
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" class="icon-btn" variant="text" @click="dialog = false"></v-btn>
      </v-card-text>
      <v-card-text class="pt-2">
        <v-timeline
          truncate-line="both"
          align="start"
          density="compact"
          side="end"
        >
          <v-timeline-item
            v-for="(_, i) in thread"
            :key="i"
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

            <div class="d-flex">
              <span class="top-row-link text-grey-lighten-1 font-weight-bold">
                {{ $auth.getName() }}
              </span>
              <span class="top-row-link text-grey-darken-1">
                <span><template v-if="$auth.getName()">&ensp;</template>@{{ $auth.getUsername() }}</span>
              </span>
              <template v-if="isThread">
                <v-spacer></v-spacer>
                <div class="text-grey">
                  {{ i + 1 }}/10
                </div>
                <div v-if="i !== 0" class="ml-1">
                  <v-icon
                    icon="mdi-close"
                    size="20"
                    color="grey"
                    title="Remove"
                    style="cursor: pointer;margin-bottom: 3px"
                    @click="removeFromThread(i);clearMessage()"
                  ></v-icon>
                </div>
              </template>
            </div>
            <v-textarea
              v-model="thread[i].content"
              @update:model-value="clearMessage"
              variant="outlined"
              label="What's happening?"
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
                v-for="h in thread[i].content.match(highlightRegex)"
                :color="h[0] === '#' ? 'primary' : 'success'"
                class="mr-2 mb-2"
              >
                  <v-icon start :icon="h[0] === '#' ? 'mdi-pound' : 'mdi-at'"></v-icon>
                  {{ h.slice(1) }}
              </v-chip>
            </div>
            <!-- <div v-if="tweet.media.length"><img :src="tweet.media[0]"></div> -->
          </v-timeline-item>
        </v-timeline>
        <div v-show="message.length" class="text-error">{{ message }}</div>
      </v-card-text>
      <v-divider class="mb-2"></v-divider>
      <v-container ref="bottomRow">
        <v-row>
          <v-btn icon class="ml-4 icon-btn" variant="text" color="primary">
            <v-icon icon="mdi-image-outline"></v-icon>
            <v-tooltip activator="parent" location="bottom">Add media</v-tooltip>
          </v-btn>
          <v-btn icon class="ml-3 icon-btn" variant="text" color="primary">
            <v-icon icon="mdi-poll"></v-icon>
            <v-tooltip activator="parent" location="bottom">Add poll</v-tooltip>
          </v-btn>
          <v-btn icon class="ml-3 icon-btn" variant="text" color="primary">
            <v-icon icon="mdi-calendar-clock-outline"></v-icon>
            <v-tooltip activator="parent" location="bottom">Schedule tweet</v-tooltip>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="addToThread" :disabled="thread.length >= 10" icon color="grey-darken-3" class="mr-2 icon-btn">
            <v-icon icon="mdi-plus"></v-icon>
            <v-tooltip v-if="!isThread" activator="parent" location="bottom">Add thread</v-tooltip>
          </v-btn>
          <v-btn @click="tweet" color="primary" class="mr-2" rounded="pill" :loading="loading">Tweet</v-btn>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
  <v-snackbar
    v-model="snackbar"
    :timeout="2000"
    color="success"
    rounded="pill"
  >
    Tweet sent
  </v-snackbar>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';

const dialog = ref(false)
const { mobile } = useDisplay()
const tweetStructure = {
  content: "",
  files: [],
  poll: {},
}
const thread = ref([{ ...tweetStructure }])
const isThread = computed(() => thread.value.length > 1)
const bottomRow = ref(null)

function addToThread() {
  if (thread.value.length < 10) {
    thread.value.push({ ...tweetStructure })
    nextTick(() => {
      bottomRow.value.$el.scrollIntoView({ behavior: "smooth" })
    })
  }
}

function removeFromThread(i) {
  thread.value.splice(i, 1)
}

const loading = ref(false)
const message = ref("")
function clearMessage() {
  message.value = ""
}
const snackbar = ref(false)

function tweet() {
  // Ensure less than 10 tweets
  thread.value = thread.value.slice(0, 10)
  // Validate tweet(s)
  for (let i = 0, n = thread.value.length; i < n; i++) {
    const tmp = thread.value[i]
    const tweetNumberMsg = n === 1 ? "" : `Tweet #${i + 1}: `
    // Slice content
    tmp.content = tmp.content.slice(0, 300).trim()
    // Check if empty
    if (!tmp.content && !tmp.files.length && !tmp.poll.choices?.length) {
      message.value = `${tweetNumberMsg}Tweet can't be empty`
      return
    }
    // Check if media and poll both present
    if (tmp.files.length && tmp.poll.choices?.length) {
      message.value = `${tweetNumberMsg}Can't have media and poll in same tweet`
      return
    }
  }
  // Send to server
  let data, error
  loading.value = true
  if (isThread.value) {
    // TODO
  } else {
    ({ data, error } = useApiFetch("/api/tweet", {
      method: "POST",
      body: { content: thread.value[0].content },
    }))
  }
  loading.value = false
  // Handle response from server
  if (error?.value) {
    message.value = "Oops, something went wrong. Please try again."
  } else {
    resetForm()
    snackbar.value = true
    dialog.value = false
  }
}

function resetForm() {
  thread.value = [{ ...tweetStructure }]
}

// (start of string or whitespace -> one hashtag -> end of string or whitespace) OR
// (start of string or whitespace -> one username -> end of string or whitespace)
const highlightRegex = ref(/(?:(?<=^|\s)(?:#[a-zA-Z]\w{0,31})(?=$|\s))|(?:(?<=^|\s)(?:@\w{1,32})(?=$|\s))/g)
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
