<template>
  <div>
    <template v-for="part in useContentSplit(content)">
      <NuxtLink v-if="part.type" :to="getLink(part)">{{ part.content }}</NuxtLink>
      <span v-else>{{ part.content }}</span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  content: String
})

function getLink(part) {
  return part.type === "hashtag" ? `/search?q=%23${part.content.slice(1)}`
        : part.type === "username" ? `/${part.content}`
        : null
}
</script>

<style scoped>
a {
  color: #299dff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
}
</style>
