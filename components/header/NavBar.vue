<template>
  <v-col lg="2" class="nav d-none d-lg-block">
    <v-container fluid>
      <v-row align="center" class="px-2 py-1">
        <div class="text-h6 nav-component" id="nav-title">Twitter</div>
      </v-row>
    </v-container>
  </v-col>
  <v-col sm="8" md="7" lg="6" class="nav">
    <v-container fluid>
      <v-row align="center" class="px-2 py-1">
        <input
          placeholder="Search"
          id="app-search-bar"
          class="px-4 nav-component"
        >
      </v-row>
    </v-container>
  </v-col>
  <v-col md="4" lg="3" class="nav d-none d-md-block">
    <v-container fluid>
      <v-row justify="end" align="center" class="px-2 py-1">
        <HeaderLoginModal />
        <HeaderSignUpModal />
      </v-row>
    </v-container>
  </v-col>
</template>

<style scoped>
.v-col {
  padding: unset;
  border: solid 1px green;
}
#nav-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}
.nav-component {
  height: 36px;
}
#app-search-bar {
  flex: 1;
  border-radius: 18px;
  border: solid thin grey;
  outline: none;
  background: black;
}
</style>
