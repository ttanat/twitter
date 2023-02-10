<template>
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
        {{ tweetNumber + 1 }}/10
      </div>
      <div v-if="tweetNumber !== 0" class="ml-1">
        <v-icon
          icon="mdi-close"
          size="20"
          color="grey"
          title="Remove"
          style="cursor: pointer;margin-bottom: 3px"
          @click="$emit('removeFromThread', tweetNumber)"
        ></v-icon>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  isThread: Boolean,
  tweetNumber: Number,
})
defineEmits(["removeFromThread"])
</script>
