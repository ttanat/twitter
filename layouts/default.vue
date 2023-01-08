<template>
  <HeaderNavBar />
  <v-main>
    <v-container fluid class="pt-3 fill-height">
      <v-row :justify="sm ? 'start' : 'center'">
        <slot></slot>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';

const { sm } = useDisplay() // Bug: value is always false on hard page load
</script>

<style scoped>
.v-container {
  max-width: 1280px;
  /* For xs screen size (but changes on all screen sizes) */
  padding-left: 11px;
  padding-right: 11px;
  /* In case tweets don't fill up to bottom of page */
  min-height: calc(100vh - 48px);
  /* Make v-col reach bottom of viewport */
  margin-bottom: -4px;
}
.v-row {
  /* In case tweets don't fill up to bottom of page */
  min-height: calc(100vh - 48px);
}
</style>

<style>
/* Global */
a {
  text-decoration: none;
}
.v-tab__slider {
  height: 4px;
  border-radius: 9999px;
}
</style>
