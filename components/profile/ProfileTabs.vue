<template>
  <v-tabs v-model="tab" align-tabs="center" grow color="primary" slider-color="primary">
    <v-tab value="one">Tweets</v-tab>
    <v-tab value="two">Replies</v-tab>
    <v-tab value="three">Media</v-tab>
    <v-tab value="four">Likes</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="one"></v-window-item>
    <v-window-item value="two"></v-window-item>
    <v-window-item value="three"></v-window-item>
    <v-window-item value="four"></v-window-item>
  </v-window>
</template>

<script setup>
const tab = ref(null)
</script>
