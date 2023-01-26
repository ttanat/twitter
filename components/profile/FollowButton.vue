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

async function follow() {
  if (!$auth.loggedIn()) {
    return false
  }
  loading.value = true
  const { error } = await useApiFetch("/api/follow", {
    method: props.isFollowing ? "POST" : "POST",
    query: { username: props.username }
  })
  if (error.value) {
    console.log(error.value)
  } else {
    emit("handleFollow", !props.isFollowing)
  }
  loading.value = false
}
</script>
