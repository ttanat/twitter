<template>
  <v-dialog
    v-model="dialog"
    activator="parent"
    :width="smAndDown ? '' : '640'"
    :fullscreen="smAndDown"
    transition="scale-transition"
    scrim="black"
  >
    <v-card class="pb-2" :style="[smAndDown ? '' : 'border-radius: 18px']">
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
                <span>&ensp;@{{ $auth.getUsername() }}</span>
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
                v-for="h in useContentHighlight(thread[i].content)"
                :color="h[0] === '#' ? 'primary' : 'success'"
                class="mr-2 mb-2"
              >
                  <v-icon start :icon="h[0] === '#' ? 'mdi-pound' : 'mdi-at'"></v-icon>
                  {{ h.slice(1) }}
              </v-chip>
            </div>
            <CreateTweetModalPoll
              v-if="thread[i].poll"
              :choices="thread[i].poll.choices"
              :expiry="thread[i].poll.expiry"
              :tweet-number="i"
              :get-total-minutes="getTotalPollMinutes"
              :total-allowed-minutes="totalAllowedPollMinutes"
              @remove-choice="removePollChoice"
              @expiry-change="handlePollExpiryChange"
              @clear-message="clearMessage"
            />
            <CreateTweetModalButtons
              v-if="isThread"
              :tweet="thread[i]"
              :tweet-number="i"
              @add-poll="addPoll"
              @add-poll-choice="addPollChoice"
              @remove-poll="removePoll"
            />
            <!-- <div v-if="tweet.media.length"><img :src="tweet.media[0]"></div> -->
          </v-timeline-item>
        </v-timeline>
        <div v-show="message.length" class="text-error">{{ message }}</div>
      </v-card-text>
      <v-divider class="mb-2"></v-divider>
      <CreateTweetModalBottomRow
        :thread="thread"
        :is-thread="isThread"
        :loading="loading"
        @add-to-thread="addToThread"
        @add-poll="addPoll"
        @remove-poll="removePoll"
        @tweet="tweet"
      />
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
  <v-snackbar
    v-model="pollSnackbar"
    :timeout="5000"
    color="primary"
    rounded="pill"
  >
    Poll(s) expires in 1 day
  </v-snackbar>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';

const dialog = ref(false)
const { smAndDown } = useDisplay()
const tweetStructure = {
  content: "",
  media: undefined, // or []
  poll: undefined, // or {}
}
function getNewTweet() {
  return structuredClone(tweetStructure)
}

const thread = ref([getNewTweet()])
const isThread = computed(() => thread.value.length > 1)
function addToThread() {
  if (thread.value.length < 10) {
    thread.value.push(getNewTweet())
  }
}
function removeFromThread(i) {
  thread.value.splice(i, 1)
}

function addPoll(tweetNumber) {
  thread.value[tweetNumber].poll = {
    choices: ["", ""],
    expiry: { days: null, hours: null, minutes: null },
  }
}
function removePoll(tweetNumber) {
  thread.value[tweetNumber].poll = null
}
function addPollChoice(tweetNumber) {
  const { poll } = thread.value[tweetNumber]
  if (poll.choices.length < 4) {
    poll.choices.push("")
  }
}
function removePollChoice(choiceNumber, tweetNumber) {
  const { choices } = thread.value[tweetNumber].poll
  if (choices.length > 2) {
    choices.splice(choiceNumber, 1)
  } else {
    choices[choiceNumber] = ""
  }
}
function handlePollExpiryChange(tweetNumber) {
  const { expiry } = thread.value[tweetNumber].poll
  // Remove zeros
  if (expiry.days == 0) expiry.days = null
  if (expiry.hours == 0) expiry.hours = null
  if (expiry.minutes == 0) expiry.minutes = null
  // Check that expiry is within 7 days
  const totalMinutes = getTotalPollMinutes(expiry.days, expiry.hours, expiry.minutes)
  if (totalMinutes > totalAllowedPollMinutes) {
    handleTweetError("Poll must expire within 7 days", tweetNumber)
  } else {
    clearMessage()
  }
}
function getTotalPollMinutes(days, hours, minutes) {
  return parseInt(days || 0) * 24 * 60 + parseInt(hours || 0) * 60 + parseInt(minutes || 0)
}
const totalAllowedPollMinutes = 7 * 24 * 60

const loading = ref(false)
const message = ref("")
function clearMessage() {
  message.value = ""
}
const snackbar = ref(false)
const pollSnackbar = ref(false)

async function tweet() {
  // Ensure less than 10 tweets
  thread.value = thread.value.slice(0, 10)
  // Validate tweet(s)
  for (let i = 0, n = thread.value.length; i < n; i++) {
    const tmp = thread.value[i]
    // Slice content
    tmp.content = tmp.content.slice(0, 300).trim()
    // Check if empty
    if (!tmp.content && !tmp.media?.length && !tmp.poll?.choices?.length) {
      handleTweetError("Tweet can't be empty", i)
      return
    }
    // Check if media and poll both present
    if (tmp.media?.length && tmp.poll?.choices?.length) {
      handleTweetError("Can't have media and poll in same tweet", i)
      return
    }
    // Check valid poll
    if (tmp.poll) {
      const { choices, expiry } = tmp.poll
      if (choices?.length < 2 ||  choices?.length > 6) {
        handleTweetError("Poll must have between 2 and 6 choices", i)
        return
      }
      for (const choice of choices) {
        if (!choice) {
          handleTweetError("Choice(s) cannot be empty", i)
          return
        }
      }
      const [days, hours, minutes] = [parseInt(expiry.days || 0), parseInt(expiry.hours || 0), parseInt(expiry.minutes || 0)]
      if (days < 0 || hours < 0 || minutes < 0) {
        handleTweetError("Invalid number", i)
        return
      }
      const totalMinutes = getTotalPollMinutes(days, hours, minutes)
      if (totalMinutes > totalAllowedPollMinutes) {
        handleTweetError("Poll must expire within 7 days", i)
        return
      }
    }
  }
  // Send to server
  let response
  loading.value = true
  if (isThread.value) {
    // TODO
  } else {
    // Avoid errors with proxies and reactive values
    const tmp = JSON.parse(JSON.stringify(thread.value[0]))
    response = await useApiFetch("/api/tweet", {
      method: "POST",
      body: { content: tmp.content, poll: tmp.poll },
    })
  }
  loading.value = false
  const { data, error } = response
  // Handle response from server
  if (!error.value) {
    message.value = "Oops, something went wrong. Please try again."
  } else {
    // Show poll snackbar if expiration not manually set on any polls
    for (const tweet of thread.value) {
      const expiry = tweet.poll?.expiry
      if (expiry && !expiry.days && !expiry.hours && !expiry.minutes) {
        setTimeout(() => { pollSnackbar.value = true }, 2000)
        break
      }
    }
    resetForm()
    snackbar.value = true
    dialog.value = false
  }
}
function handleTweetError(msg, tweetNumber) {
  const tweetNumberMsg = thread.value.length === 1 ? "" : `Tweet #${tweetNumber + 1}: `
  message.value = `${tweetNumberMsg}${msg}`
}

function resetForm() {
  thread.value = [getNewTweet()]
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
