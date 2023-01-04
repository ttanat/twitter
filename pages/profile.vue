<template>
  <v-col lg="2" class="d-none d-lg-block mr-5">
    <LeftColumn />
  </v-col>
  <v-col sm="8" md="7" lg="6" class="mid-col ml-5">
    {{ profile }}
    <TweetList />
  </v-col>
  <v-col md="4" lg="3" class="d-none d-md-block">
  </v-col>
</template>

<script setup>
  const { data: profile } = await apiFetch("/api/profile", { server: true })
</script>

<style scoped>
.v-col {
  padding: unset;
}
.mid-col {
  border-left: solid 1px grey;
  border-right: solid 1px grey;
}
</style>
