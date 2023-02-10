<template>
  <div class="mt-1 mb-4">
    <v-form>
      <!-- Choices -->
      <v-text-field
        v-for="(_, i) in choices"
        :key="i"
        v-model="choices[i]"
        :placeholder="`Choice #${i + 1}`"
        counter="25"
        maxlength="25"
        variant="outlined"
        density="compact"
        :append-icon="choices.length > 2 ? 'mdi-close' : ''"
        @click:append="removeChoice(i)"
        :rules="choiceRules"
        @update:model-value="$emit('clearMessage')"
      ></v-text-field>
      <!-- Expiry -->
      <v-container>
        <v-row align="center">
          <span class="mr-2">Expires in:</span>
          <v-text-field
            v-model="pollLength.days"
            @update:model-value="handleExpiryChange"
            type="number"
            :max="maxDays"
            min="0"
            label="days"
            placeholder="days"
            class="mx-2 align-self-center"
            density="compact"
            single-line
            hide-details
            :disabled="disableDays"
            :rules="notNegative"
          ></v-text-field>
          <v-text-field
            v-model="pollLength.hours"
            @update:model-value="handleExpiryChange"
            type="number"
            :max="maxHours"
            min="0"
            label="hours"
            placeholder="hours"
            class="mx-2"
            density="compact"
            single-line
            hide-details
            :disabled="disableHours"
            :rules="notNegative"
          ></v-text-field>
          <v-text-field
            v-model="pollLength.minutes"
            @update:model-value="handleExpiryChange"
            type="number"
            :max="maxMinutes"
            min="0"
            label="minutes"
            placeholder="minutes"
            class="ml-2"
            density="compact"
            single-line
            hide-details
            :disabled="disableMinutes"
            :rules="notNegative"
          ></v-text-field>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script setup>
const props = defineProps({
  choices: Array,
  pollLength: Object,
  tweetNumber: Number,
})
const emit = defineEmits(["removeChoice", "expiryChange", "clearMessage"])

function removeChoice(i) {
  emit("removeChoice", i, props.tweetNumber)
}

function getTotalMinutes(days, hours, minutes) {
  return parseInt(days || 0) * 24 * 60 + parseInt(hours || 0) * 60 + parseInt(minutes || 0)
}
const totalAllowedMinutes = 7 * 24 * 60

/* Compute total minutes used in expiry so user cannot go over */
const totalMinutes = computed(() => {
  return getTotalMinutes(props.pollLength.days, props.pollLength.hours, props.pollLength.minutes)
})
const minutesLeft = computed(() => totalAllowedMinutes - totalMinutes.value)
const maxMinutes = computed(() => minutesLeft.value + props.pollLength.minutes)
const maxHours = computed(() => Math.floor(minutesLeft.value / 60) + props.pollLength.hours)
const maxDays = computed(() => Math.floor(minutesLeft.value / 60 / 24) + props.pollLength.days)

function handleExpiryChange() {
  emit("expiryChange", props.tweetNumber)
  emit("clearMessage")
}

const disableDays = computed(() => props.pollLength.hours == 7 * 24 || props.pollLength.minutes == 7 * 24 * 60)
const disableHours = computed(() => props.pollLength.days == 7 || props.pollLength.minutes == 7 * 24 * 60)
const disableMinutes = computed(() => props.pollLength.days == 7 || props.pollLength.hours == 7 * 24)

const choiceRules = [
  v => (v || "").length >= 1 || "Choice must have at least 1 character",
  v => (v || "").length <= 25 || "Choice cannot be longer than 32 characters",
]
const notNegative = [
  v => (parseInt(v) >= 0 || !v) || "Cannot be negative"
]
</script>
