<template>
  <div class="d-flex text-grey-darken-1" style="margin-top: 2px">
    <div class="flex-grow-1">
      <v-btn class="replies" prepend-icon="mdi-comment-outline" density="compact" variant="text" rounded="pill">
        {{ useNumber(tweet.numReplies) }}
      </v-btn>
    </div>
    <div class="flex-grow-1">
      <v-btn class="retweets" density="compact" variant="text" rounded="pill" width="30px">
        <v-icon size="24" icon="mdi-repeat-variant" style="padding-bottom: 2px"></v-icon>
        <span style="font-size: 12px">&ensp;</span>{{ useNumber(tweet.numRetweets) }}
      </v-btn>
    </div>
    <div class="flex-grow-1">
      <v-btn class="likes" prepend-icon="mdi-heart-outline" density="compact" variant="text" rounded="pill">
        {{ useNumber(tweet.numLikes) }}
      </v-btn>
    </div>
    <div class="flex-grow-1">
      <v-btn class="hamburger replies" icon density="compact" variant="text" rounded="circle">
        <v-icon size="24" icon="mdi-dots-horizontal"></v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    tweet: Object
  })
</script>

<style scoped>
.v-btn {
  margin-left: -13px;
}
.replies:hover {
  color: #299ded;
}
.retweets:hover {
  color: #40a440;
}
.likes:hover {
  color: #dc3065;
}
</style>
