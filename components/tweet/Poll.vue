<template>
  <v-progress-circular v-if="checkingIfVoted" indeterminate></v-progress-circular>
  <div v-else class="no-navigate" ref="pollDiv">
    <div
      v-for="(choice, i) in choices"
      :class="{ 'my-2': i === 0 || i === choices.length, 'my-3': i !== 0 && i !== choices.length }"
    >
      <!-- Poll choices -->
      <div
        v-if="!voted && timeLeft"
        @click="selectChoice"
        class="px-2 poll-choice"
      >
        <input type="radio" :id="choice._id" :name="poll._id" :value="choice.choice" class="mr-2">
        <label :for="choice._id">{{ choice.choice }}</label>
      </div>
      <!-- Poll results -->
      <v-progress-linear
        v-else
        v-model="choice.percentage"
        color="blue-darken-1"
        height="27"
        class="rounded no-navigate"
      >
        <span class="ml-2">{{ choice.choice }}</span>
        <v-spacer></v-spacer>
        <span class="mr-2">{{ choice.percentage }}%</span>
      </v-progress-linear>
    </div>
    <div class="text-grey no-navigate">
      <span>{{ poll.totalNumVotes }} votes</span>
      <span>&ensp;&bull;&ensp;</span>
      <span :title="expiryDate.toLocaleString()">{{ timeLeft || "Final results" }}</span>
      <template v-if="timeLeft">
        <span>&ensp;&bull;&ensp;</span>
        <span v-if="voted">Voted</span>
        <v-btn v-else @click="vote" :disabled="voting" rounded="pill" size="small">Vote</v-btn>
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tweet_id: String,
  poll: Object,
})

const { $auth: auth } = useNuxtApp()

const voted = ref(false)
const checkingIfVoted = ref(auth.loggedIn())
if (auth.loggedIn()) {
  const { data } = await useApiFetch("/api/tweet/voted", {
    query: { tweet_id: props.tweet_id }
  })
  voted.value = data.value.voted
  checkingIfVoted.value = false
}

const choices = ref(props.poll.choices.map(choice => {
  const percentage = Math.round((choice.numVotes / props.poll.totalNumVotes) * 100) || 0
  return { ...choice, percentage }
}))

function selectChoice(e) {
  /* For when user doesn't click on input or label */
  const tmp = e.target.childNodes?.[0]
  if (tmp?.nodeName === "INPUT") {
    tmp.click()
  }
}

const expiryDate = new Date(props.poll.expiry)
const timeLeft = computed(() => {
  const msLeft = expiryDate.getTime() - new Date().getTime()
  const daysLeft = msLeft / 1000 / 60 / 60 / 24
  if (daysLeft > 1) {
    const n = Math.round(daysLeft)
    return `${n} day${n > 1 ? "s" : ""} left`
  }
  const hoursLeft = msLeft / 1000 / 60 / 60
  if (hoursLeft > 1) {
    const n = Math.round(hoursLeft)
    return `${n} hour${n > 1 ? "s" : ""} left`
  }
  const minutesLeft = msLeft / 1000 / 60
  if (minutesLeft > 1) {
    const n = Math.round(minutesLeft)
    return `${n} minute${n > 1 ? "s" : ""} left`
  }
  const secondsLeft = msLeft / 1000
  if (secondsLeft > 1) {
    const n = Math.round(secondsLeft)
    return `${n} second${n > 1 ? "s" : ""} left`
  }
  return ""
})

const pollDiv = ref(null)
const voting = ref(false)
async function vote() {
  if (!auth.loggedIn()) {
    return false
  }
  voting.value = true
  // Get poll choice that user selected
  let selectedChoice
  const choices = pollDiv.value.querySelectorAll(`input[name='${props.poll._id}']`)
  for (const tmp of choices) {
    if (tmp.checked) {
      selectedChoice = tmp.value
      break
    }
  }
  // Send request
  if (selectedChoice) {
    const { error } = await useApiFetch("/api/tweet/vote", {
      method: "POST",
      body: { tweet_id: props.tweet_id, choice: selectedChoice },
    })
    if (error.value) {
      console.log(error.value)
    } else {
      voted.value = true
    }
  }
  voting.value = false
}
</script>

<style scoped>
.poll-choice {
  border: solid 1px #555;
  border-radius: 5px;
  cursor: pointer;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}
</style>
