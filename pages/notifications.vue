<template>
  <BaseLayout>
    <NotificationsFollowRequest
      v-if="!pending"
      v-for="(user, i) in data.requests"
      :user="user"
      :key="i"
    />
  </BaseLayout>
</template>

<script setup>
definePageMeta({ middleware: ["auth"] })
useHead({ title: "Notifications" })
useState("navBarRoute").value = "Notifications"

const { data, pending } = await useApiFetch("/api/notifications/requests")
</script>
