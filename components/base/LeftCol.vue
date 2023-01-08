<template>
  <v-col sm="2" md="1" lg="2" class="d-none d-sm-block mr-lg-5">
    <slot>
      <BaseLeftSideBar />
    </slot>
  </v-col>
</template>

<style scoped>
.v-col {
  padding: unset;
}
</style>
