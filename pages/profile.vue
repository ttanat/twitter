<template>
  <BaseLayout v-if="$auth.loggedIn()">
    <ProfileItem />
  </BaseLayout>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"]
})
useState("navBarRoute").value = "Profile"
</script>
