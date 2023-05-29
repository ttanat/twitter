<template>
  <div v-if="!pending" class="ma-3 ml-8 trending">
    <div class="px-3 py-3 section"><h4>Trending</h4></div>
    <div class="px-3 py-3 section"><h4>1.&ensp;#{{ data.trending[0] }}</h4></div>
    <div class="px-3 py-3 section"><h4>2.&ensp;#{{ data.trending[1] }}</h4></div>
    <div class="px-3 py-3 section"><h4>3.&ensp;#{{ data.trending[2] }}</h4></div>
    <div class="px-3 py-3 section"><h4>4.&ensp;#{{ data.trending[3] }}</h4></div>
    <div class="px-3 py-3"><h4>5.&ensp;#{{ data.trending[4] }}</h4></div>
  </div>
</template>

<script setup>
const { data, pending } = await useApiFetch("/api/trending")
</script>

<style scoped>
.trending {
  background: #151515;
  border: 1px solid grey;
  border-radius: 10px;
}
.section {
  border-bottom: 1px solid grey;
}
</style>
