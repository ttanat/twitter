<template>
  <v-col lg="2" class="d-none d-lg-block mr-5">
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
