<template>
  <BaseLayout>
    <ProfileItem />
  </BaseLayout>
</template>

<script setup>
definePageMeta({
  middleware: ["profile-redirect"]
})
</script>
