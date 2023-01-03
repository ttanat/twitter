<template>
  <div class="d-flex">
    <div class="mr-auto">
      <NuxtLink :to="'/@'+tweet.user.username" class="top-row-link text-grey-lighten-1 font-weight-bold">
        {{ tweet.user.name }}
      </NuxtLink>
      <NuxtLink :to="'/@'+tweet.user.username" class="top-row-link text-grey-darken-1">
        <span><template v-if="tweet.user.name">&ensp;</template>@{{ tweet.user.username }}</span>
      </NuxtLink>
    </div>
    <div class="text-grey-darken-1">
      {{ useTimestamp(tweet.timestamp) }}
      <v-tooltip activator="parent" location="bottom">{{ useFullTimestamp(tweet.timestamp) }}</v-tooltip>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    tweet: Object
  })
</script>

<style scoped>
.top-row-link {
  color: inherit;
  text-decoration: none;
}
.top-row-link:first-child:hover {
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
}
</style>
