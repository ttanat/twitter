<template>
  <div class="justify-center align-self-center">
    <v-progress-circular indeterminate></v-progress-circular>&ensp;<span class="text-h6">Logging out...</span>
  </div>
</template>

<script setup>
  useNuxtApp().$auth.logout()
</script>
