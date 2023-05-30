<template>
  <v-menu v-model="menu" activator="parent" location="center" scroll-strategy="close">
    <v-list>
      <v-list-item v-if="$auth.loggedIn()" @click="bookmark">
        <v-list-item-title>
          <v-icon :icon="isBookmarksPath ? 'mdi-bookmark-outline' : 'mdi-bookmark'"></v-icon>
          {{ isBookmarksPath ? "Unbookmark" : "Bookmark" }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="copyLink">
        <v-list-item-title>
          <v-icon icon="mdi-link-variant"></v-icon>
          Copy link
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor" rounded="pill">{{ snackbarMessage }}</v-snackbar>
</template>

<script setup>
const props = defineProps({
  tweet_id: String,
})

const route = useRoute()
const menu = ref(false)
const isBookmarksPath = ref(route.path === "/bookmarks")

const snackbar = ref(false)
const snackbarColor = ref("")
const snackbarMessage = ref("")

async function bookmark() {
  const { data, error } = await useApiFetch("/api/tweet/bookmark", {
    method: isBookmarksPath.value ? "DELETE" : "POST",
    query: { _id: props.tweet_id },
  })
  if (data.value) {
    snackbarMessage.value = data.value
    snackbarColor.value = "success"
  } else if (error.value) {
    snackbarMessage.value = error.value.statusMessage
    snackbarColor.value = "red"
  }
  snackbar.value = true
}

async function copyLink() {
  const link = `${window.location.origin}/status/${props.tweet_id}`
  navigator.clipboard.writeText(link).then(() => {
    snackbarMessage.value = "Copied!"
    snackbarColor.value = "success"
  }, (err) => {
    snackbarMessage.value = "Oops, something went wrong."
    snackbarColor.value = "red"
  }).finally(() => {
    snackbar.value = true
  })
}
</script>
