<template>
  <div v-for="user in users" :key="user.username">
    <div class="pa-3 tweet-item">
      <v-timeline
        truncate-line="both"
        align="start"
        density="compact"
        side="end"
      >
        <v-timeline-item
          dot-color="#424242"
          class="pl-2 pointer"
          width="100%"
          @click="openTweet"
        >
          <template v-slot:icon>
            <NuxtLink :to="'/@'+user.username">
              <v-avatar
                :image="user.image"
                icon="mdi-account"
                size="45"
                :style="[user.image ? 'margin-top: 6px' : '']"
              ></v-avatar>
            </NuxtLink>
          </template>

          <div class="d-flex">
            <div class="mr-auto">
              <NuxtLink :to="'/@'+user.username" class="text-grey-lighten-1 font-weight-bold">
                {{ user.name }}
              </NuxtLink>
              <NuxtLink :to="'/@'+user.username" class="text-grey-darken-1">
                <span><template v-if="user.name">&ensp;</template>@{{ user.username }}</span>
              </NuxtLink>
            </div>
          </div>
          <div>{{ user.bio }}</div>
        </v-timeline-item>
      </v-timeline>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  }
})

const { data: users } = await useApiFetch(props.url)

function openTweet() {}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.tweet-item {
  font-size: 15px;
}
.v-timeline-item > :first-child {
  padding-inline-start: 12px !important;
}
</style>
