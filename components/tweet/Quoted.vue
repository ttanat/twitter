<template>
  <div class="rounded-lg w-100 px-2 py-1 mt-1" style="border: solid 1px grey">
    <div class="d-flex">
      <v-avatar
        :image="tweet.user.image"
        icon="mdi-account-circle"
        density="compact"
        rounded="circle"
        size="20"
        class="align-self-center mr-1"
      ></v-avatar>
      <span class="top-row-link text-grey-lighten-1 font-weight-bold">
        {{ tweet.user.name }}
      </span>
      <span class="top-row-link text-grey-darken-1">
        <span>&ensp;@{{ tweet.user.username }}</span>
      </span>
      <v-spacer></v-spacer>
      <span class="text-grey-darken-1">{{ useTimestamp(tweet.timestamp) }}</span>
    </div>
    <div>{{ tweet.content }}</div>
  </div>
</template>

<script setup>
defineProps({
  tweet: Object,
})
</script>
