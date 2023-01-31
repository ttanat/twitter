<template>
  <v-menu v-model="menu" activator="parent" :disabled="!$auth.loggedIn()" location="center" scroll-strategy="close">
    <v-list>
      <v-list-item @click="$emit('handleRetweet')">
        <v-list-item-title>
          <v-icon icon="mdi-repeat-variant"></v-icon>
          {{ isRetweeted ? "Undo retweet" : "Retweet" }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-title>
          <v-icon icon="mdi-format-quote-close"></v-icon>
          Quote tweet
        </v-list-item-title>
        <TweetQuoteModal :quote="quote" @close="menu = false" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
const props = defineProps({
  isRetweeted: Boolean,
  quote: String,
})
defineEmits(["handleRetweet"])

const menu = ref(false)
</script>
