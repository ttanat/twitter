<template>
  <MessageLayout :loading="true">
    Logging out...
  </MessageLayout>
</template>

<script setup>
useNuxtApp().$auth.logout()
</script>
