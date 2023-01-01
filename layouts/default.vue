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
