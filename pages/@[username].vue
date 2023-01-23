<template>
  <BaseLayout>
    <ProfileItem />
  </BaseLayout>
</template>

<script setup>
const route = useRoute()
useHead({ title: `@${route.params.username}`})
definePageMeta({
  middleware: ["profile-redirect"]
})
useState("navBarRoute").value = `@${route.params.username}`
</script>
