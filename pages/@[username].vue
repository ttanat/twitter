<template>
  <BaseLayout>
    <ProfileItem />
  </BaseLayout>
</template>

<script setup>
definePageMeta({
  middleware: ["profile-redirect"]
})
useState("navBarRoute").value = `@${useRoute().params.username}`
</script>
