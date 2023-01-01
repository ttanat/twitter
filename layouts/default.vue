<template>
  <HeaderNavBar />
  <v-main>
    <v-container fluid class="pt-3 fill-height">
      <v-row justify="center">
        <slot></slot>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.v-container {
  max-width: 1280px;
  min-height: calc(100vh - 48px);
  margin-bottom: -4px;
}
.v-row {
  min-height: calc(100vh - 48px);
}
</style>
