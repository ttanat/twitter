<template>
  <!-- Don't know how calc() works but it does -->
  <v-btn
    v-if="$auth.getUsername() !== username"
    :color="isFollowing? 'grey' : 'white'"
    rounded="pill"
    :variant="isFollowing ? 'outlined' : 'elevated'"
    class="font-weight-bold"
    style="margin-bottom: -14px"
    :style="[isFollowing ? 'margin-left: calc(100% - 250px)' : 'margin-left: calc(100% - 220px)']"
    @click="follow"
    :loading="loading"
  >
    {{ btnText }}
  </v-btn>
  <v-btn
    v-else
    color="primary"
    rounded="pill"
    variant="outlined"
    style="margin-bottom: -14px;margin-left: calc(100% - 193px)"
  >
    Edit
  </v-btn>
</template>

<script setup>
const props = defineProps({
  isFollowing: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    required: true,
  }
})
const { $auth } = useNuxtApp()
const emit = defineEmits(["handleFollow"])

const btnText = computed(() => props.isFollowing ? "Following" : "Follow")
const loading = ref(false)

function follow() {
  if (!$auth.loggedIn()) {
    return false
  }
  loading.value = true
  const { error } = useApiFetch("/api/follow", {
    method: props.isFollowing ? "DELETE" : "POST",
    query: { username: props.username }
  })
  if (error) {
    console.log(error.message)
  } else {
    emit("handleFollow", !props.isFollowing)
  }
  loading.value = false
}
</script>
