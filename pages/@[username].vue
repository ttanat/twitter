<template>
  <v-col lg="2" class="d-none d-lg-block mr-5">
    <LeftColumn />
  </v-col>
  <v-col sm="8" md="7" lg="6" class="mid-col ml-5">
    <!-- <TweetList /> -->
    {{ user }}
  </v-col>
  <v-col md="4" lg="3" class="d-none d-md-block">
  </v-col>
</template>

<script setup>
  const { data: user, error } = await apiFetch("/api/profile", { query: { username: useRoute().params.username }})
</script>
