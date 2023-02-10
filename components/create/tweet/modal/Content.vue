<template>
  <v-textarea
    v-model="tweet.content"
    @update:model-value="$emit('clearMessage')"
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
      v-for="h in useContentHighlight(tweet.content)"
      :color="h[0] === '#' ? 'primary' : 'success'"
      class="mr-2 mb-2"
    >
        <v-icon start :icon="h[0] === '#' ? 'mdi-pound' : 'mdi-at'"></v-icon>
        {{ h.slice(1) }}
    </v-chip>
  </div>
</template>

<script setup>
defineProps({
  tweet: Object,
})
defineEmits(["clearMessage"])
</script>
