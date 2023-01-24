<template>
  <div class="d-flex mb-3">
    <!-- Image -->
    <NuxtLink :to="'/@'+tweet.user.username" class="user-link mr-3">
      <v-avatar
        :image="tweet.user.image"
        icon="mdi-account"
        color="grey-darken-4"
        size="48"
      ></v-avatar>
    </NuxtLink>
    <!-- Name and username -->
    <NuxtLink :to="'/@'+tweet.user.username" class="user-link">
      <div style="height: 4px"></div>
      <div class="header font-weight-bold underline">{{ tweet.user.name }}</div>
      <div class="header fs-15 text-grey-darken-1">@{{ tweet.user.username }}</div>
    </NuxtLink>
    <v-spacer></v-spacer>
    <!-- Menu -->
    <v-btn icon density="compact" variant="text" rounded="circle" color="grey" style="margin-top: 4px">
      <v-icon size="24" icon="mdi-dots-horizontal"></v-icon>
      <v-menu activator="parent" :disabled="!$auth.loggedIn()" location="bottom right">
        <v-list v-if="editing">
          <v-list-item disabled>Editing tweet...</v-list-item>
        </v-list>
        <v-list v-else>
          <v-list-item
            v-for="(action, i) in actions"
            :key="i"
            :value="action.action"
            @click="handleAction(action.action)"
          >
            <v-list-item-title v-if="editing && action.action === 'edit'">Editing</v-list-item-title>
            <v-list-item-title v-else>{{ action.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </div>
  <!-- Delete alert -->
  <v-alert v-if="showDeleteAlert" color="error" variant="tonal" class="my-1">
    <div class="mb-4">Are you sure you want to delete this tweet?</div>
    <div class="d-flex flex-row align-center justify-space-between">
      <v-btn @click="deleteTweet" :loading="deleting" color="error" variant="outlined" class="flex-grow-1">
        Delete
      </v-btn>
      <v-btn @click="showDeleteAlert = false" color="secondary" class="flex-grow-1 ml-5">
        Cancel
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup>
const props = defineProps({
  tweet: Object,
  editing: Boolean,
  canEdit: Boolean,
})
const emit = defineEmits(["handleEdit"])

const route = useRoute()

const isSelfTweet = useNuxtApp().$auth.getUsername() === props.tweet.user.username
const editAction = { title: "Edit tweet", action: "edit" }
const deleteAction = { title: "Delete tweet", action: "delete" }
const reportAction = { title: "Report tweet", action: "report" }
const actions = isSelfTweet ? (props.canEdit ? ref([editAction, deleteAction]) : ref([deleteAction])) : ref([reportAction])

function handleAction(action) {
  switch (action) {
    case "edit":
      emit("handleEdit")
      break
    case "delete":
      showDeleteAlert.value = true
      break
    case "report":
      reportTweet()
      break
  }
}

const showDeleteAlert = ref(false)
const deleting = ref(false)
async function deleteTweet() {
  deleting.value = true
  /*
    Use different route because using same route with different method causes errors
    Tweet prop in parent components are changed to empty string
  */
  const { error } = await useApiFetch("/api/tweet/delete", {
    method: "DELETE",
    query: { _id: route.params._id },
  })
  deleting.value = false
  if (error?.value) {
    console.log(error.value)
  } else {
    // Reload page because error occurs when rerendering tweet as deleted tweet
    window.location.reload()
  }
}

async function reportTweet() {
  // TODO
}
</script>

<style scoped>
.header {
  height: 20px;
}
.fs-15 {
  font-size: 15px;
}
.user-link {
  color: inherit;
}
.underline:hover {
  text-decoration: underline;
}
</style>
