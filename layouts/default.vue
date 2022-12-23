<template>
  <v-main>
    <v-container fluid style="max-width: 1280px">
      <v-row justify="center" style="border: 1px blue solid">

        <!-- Nav Bar -->
        <v-col lg="3" class="d-none d-lg-block">
          <v-container fluid>
            <v-row align="center" class="px-2 py-1">
              <div class="nav-component text-h6" id="nav-title">Twitter</div>
            </v-row>
          </v-container>
        </v-col>
        <v-col sm="8" md="7" lg="5">
          <v-container fluid>
            <v-row align="center" class="px-2 py-1">
              <input placeholder="Search" id="app-search-bar" class="px-4 nav-component">
            </v-row>
          </v-container>
        </v-col>
        <v-col md="4" lg="3" class="d-none d-md-block">
          <v-container fluid>
            <v-row justify="end" align="center" class="px-2 py-1">
              <div class="nav-component">
                <v-btn class="mr-2" rounded="pill" variant="outlined" color="grey">Login</v-btn>
                <v-btn rounded="pill" variant="outlined" color="primary">Sign Up</v-btn>
              </div>
            </v-row>
          </v-container>
        </v-col>

        <!-- Main content -->
        <slot></slot>

      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.v-col {
  padding: unset;
  border: solid 1px green;
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
