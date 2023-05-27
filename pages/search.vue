<template>
  <BaseLayout>
    <v-tabs v-model="tab" align-tabs="center" grow color="primary" slider-color="primary">
      <v-tab value="1">Tweets</v-tab>
      <v-tab value="2">Users</v-tab>
    </v-tabs>
    <div style="height: 1px;background: grey"></div>
    <v-window v-model="tab">
      <v-window-item value="1">
        <TweetFeedList :url="url" :key="keyForRefreshingComponent" />
      </v-window-item>
      <v-window-item value="2">
        <UserSearchList :url="url2" :key="keyForRefreshingComponent" />
      </v-window-item>
    </v-window>
  </BaseLayout>
</template>

<script setup>
useHead({ title: "Search" })
useState("navBarRoute").value = "Search"

const route = useRoute()
const tab = ref(null)

function getNewURL() {
  return `/api/tweets/search?q=${route.query.q}&before=${new Date().toISOString()}`
}
function getNewURL2() {
  return `/api/search/user?q=${route.query.q}`
}
const url = ref(getNewURL())
const url2 = ref(getNewURL2())
const keyForRefreshingComponent = ref(0)

watch(() => route.query, () => {
  keyForRefreshingComponent.value += 1
  url.value = getNewURL()
  url2.value = getNewURL2()
})
</script>
