<template>
  <div class="no-navigate">
    <div
      v-for="(choice, i) in choices"
      :class="{ 'my-2': i === 0 || i === choices.length, 'my-3': i !== 0 && i !== choices.length }"
    >
      <v-progress-linear
        v-model="choice.percentage"
        color="blue-darken-1"
        height="30"
        class="rounded no-navigate"
      >
        <span class="ml-2">{{ choice.choice }}</span>
        <v-spacer></v-spacer>
        <span class="mr-2">{{ choice.percentage }}%</span>
      </v-progress-linear>
    </div>
    <div class="text-grey no-navigate">
      {{ poll.totalNumVotes }} votes
      &ensp;&bull;&ensp;
      <span :title="expiryDate.toLocaleString()">{{ timeLeft }}</span>
      &ensp;&bull;&ensp;
      {{ voted ? "Voted" : "Click to vote" }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  poll: Object,
  voted: {
    type: Boolean,
    default: false,
  },
})

const choices = ref(props.poll.choices.map(choice => {
  const percentage = Math.round((choice.numVotes / props.poll.totalNumVotes) * 100) || 0
  return { ...choice, percentage }
}))

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
  return "Final results"
})
</script>
