<template>
  <v-col lg="2" class="d-none d-lg-block">
    <LeftColumn />
  </v-col>
  <v-col sm="8" md="7" lg="6">
    <TweetList />
  </v-col>
  <v-col md="4" lg="3" class="d-none d-md-block">
  </v-col>
</template>

<style scoped>
.v-col {
  padding: unset;
  border: solid 1px red;
}
</style>
