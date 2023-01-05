<template>
  <div class="justify-center align-self-center">
    <span class="text-h6">
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>&nbsp;
      <slot></slot>
    </span>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    required: false,
    default: false,
  }
})
</script>

<style scoped>
.v-progress-circular {
  top: -2.5px;
}
</style>
