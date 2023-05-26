<template>
  <!-- Don't know how calc() works but it does -->
  <v-btn
    v-if="auth.getUsername() !== username"
    :color="isFollowing || isRequestingFollow ? 'grey' : 'white'"
    rounded="pill"
    :variant="isFollowing || isRequestingFollow ? 'outlined' : 'elevated'"
    class="font-weight-bold"
    style="margin-bottom: -14px"
    :style="{ 'margin-left': btnMarginLeft }"
    @click="handleFollow"
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
  isRequestingFollow: {
    type: Boolean,
    default: false,
  },
  isPrivateProfile: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    required: true,
  }
})
const { $auth: auth } = useNuxtApp()
const emit = defineEmits(["handleFollow"])

const btnText = computed(() => {
  if (props.isFollowing) {
    return "Following"
  } else if (props.isPrivateProfile) {
    return props.isRequestingFollow ? "Requesting" : "Request"
  }
  return "Follow"
})
const btnMarginLeft = computed(() => {
  return props.isFollowing ? 'calc(100% - 250px)' : // "Following"
  props.isRequestingFollow ? 'calc(100% - 256px)' : // "Requesting"
  props.isPrivateProfile ? 'calc(100% - 228px)' : // "Request"
  'calc(100% - 220px)' // "Follow"
})

const loading = ref(false)

function handleFollow() {
  if (!auth.loggedIn()) {
    return false
  }
  if (props.isPrivateProfile) {
    requestFollow()
  } else {
    follow()
  }
}

async function follow() {
  loading.value = true
  const { error } = await useApiFetch("/api/follow", {
    method: props.isFollowing ? "DELETE" : "POST",
    query: { username: props.username }
  })
  if (error.value) {
    console.log(error.value)
  } else {
    emit("handleFollow", !props.isFollowing)
  }
  loading.value = false
}

async function requestFollow() {
  loading.value = true
  const { error } = await useApiFetch("/api/follow/request", {
    method: props.isRequestingFollow ? "DELETE" : "POST",
    query: { username: props.username }
  })
  if (error.value) console.log(error.value)
  loading.value = false
}
</script>
