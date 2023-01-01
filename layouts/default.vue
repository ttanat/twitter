<template>
  <HeaderNavBar />
  <v-main>
    <v-container fluid style="max-width: 1280px">
      <v-row justify="center">
        <slot></slot>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.v-main {
  --v-layout-top: 44px !important;
}
</style>
