<template>
  <MessageLayout :loading="true">
    Logging out...
  </MessageLayout>
</template>

<script setup>
useHead({ title: "Logging out..." })
useState("navBarRoute").value = "Logout"
useNuxtApp().$auth.logout()
</script>
