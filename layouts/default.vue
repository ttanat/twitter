<template>
  <v-app-bar density="compact">
    <v-app-bar-title>Twitter</v-app-bar-title>
  </v-app-bar>
  <v-main>
    <v-container fluid style="max-width: 1280px">
      <v-row justify="center" style="border: 1px blue solid">
        <slot></slot>
      </v-row>
    </v-container>
  </v-main>
</template>
