<template>
  <div class="pa-3" style="border-bottom: 1px solid grey">
    <v-avatar
      :image="user.image"
      icon="mdi-account"
      class="mr-2 mb-1"
    ></v-avatar>
    <b>{{ user.name }}</b> (@{{ user.username }}) requested to follow you.
    <v-btn
      v-if="!responded"
      @click="respond(true)"
      :disabled="loading"
      rounded="pill"
      size="small"
      color="blue-darken-2"
      class="mx-2"
    >Accept</v-btn>
    <v-btn
      v-if="!responded"
      @click="respond(false)"
      :disabled="loading"
      rounded="pill"
      size="small"
    >Decline</v-btn>
    <v-btn v-if="responded" rounded="pill" size="small" class="mx-2" disabled>{{ response }}</v-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  }
})

const loading = ref(false)
const responded = ref(false)
const response = ref(null)

async function respond(r) {
  loading.value = true
  const { error } = await useApiFetch("/api/follow/respond", {
    method: r ? "POST" : "DELETE",
    query: { username: props.user.username },
  })
  if (error.value) {
    console.log(error)
  } else {
    responded.value = true
    response.value = r ? "Accepted" : "Declined"
  }
  loading.value = false
}
</script>
