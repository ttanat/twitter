<template>
  <BaseLayout v-if="$auth.loggedIn()">
    <ProfileItem />
  </BaseLayout>
</template>

<script setup>
definePageMeta({ middleware: ["auth"] })
useHead({ title: "Profile" })
useState("navBarRoute").value = "Profile"
</script>
