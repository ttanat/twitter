<template>
  <v-col lg="3" class="d-none d-lg-block">
  </v-col>
  <v-col sm="8" md="7" lg="5">
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
.nav-component {
  height: 36px;
}
#nav-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}
#app-search-bar {
  flex: 1;
  border-radius: 18px;
  border: solid thin grey;
  outline: none;
}
</style>
