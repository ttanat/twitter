<template>
  <div style="border-bottom: solid 1px grey">
    <div>
      <!-- Banner -->
      <v-img
        cover
        :src="profile.banner"
        class="align-end bg-grey-darken-4"
        aspect-ratio="3"
      >
      </v-img>
      <!-- Avatar -->
      <v-avatar
        color="grey-darken-4"
        size="90"
        rounded="circle"
        class="ml-5"
        style="outline: black solid 4px;margin-top: -45px"
      >
        <!-- Image -->
        <v-img v-if="profile.image" :src="profile.image" cover aspect-ratio="1"></v-img>
        <v-icon v-else icon="mdi-account" size="100"></v-icon>
      </v-avatar>
      <!-- Follow button -->
      <ProfileFollowButton
        :isFollowing="profile.isFollowing"
        :isRequestingFollow="profile.isRequestingFollow"
        :isPrivateProfile="!!profile.isPrivate"
        :username="profile.username"
        @handle-follow="(n) => {profile.isFollowing = n;profile.numFollowers += n ? 1 : -1}"
        @handle-request="(n) => {profile.isRequestingFollow = n}"
      />
    </div>
    <div class="mx-5 mt-3" style="font-size: 15px">
      <!-- Name -->
      <div class="text-h6 font-weight-black text-grey-lighten-1">
        <span>{{ profile.name }}</span>&nbsp;<v-icon v-if="profile.isVerified" icon="mdi-check-decagram" size="20" style="top: -2px" color="primary"></v-icon>
      </div>
      <!-- Username -->
      <div class="text-grey-darken-1">@{{ profile.username }}</div>
      <!-- Bio -->
      <div class="mt-2"><TweetContent :content="profile.bio" /></div>
      <!-- Link and date joined -->
      <div class="mt-2">
        <NuxtLink v-if="profile.link" :to="profile.link" target="_blank" class="profile-link">
          <v-icon icon="mdi-link-variant" color="grey-darken-1"></v-icon>
          <span>{{ profile.link }}</span>
          &ensp;
        </NuxtLink>
        <v-icon icon="mdi-calendar-month" color="grey-darken-1" style="top: -1.5px"></v-icon>
        <span class="text-grey-darken-1">&nbsp;Joined {{ useDate(profile.dateJoined) }}</span>
      </div>
      <!-- Following and followers -->
      <div class="mt-2">
        <span class="font-weight-bold text-grey-lighten-1">{{ useNumber(profile.numFollowing) }}</span>&nbsp;<span class="text-grey-darken-1">Following</span>
        &ensp;
        <span class="font-weight-bold text-grey-lighten-1">{{ useNumber(profile.numFollowers) }}</span>&nbsp;<span class="text-grey-darken-1">Followers</span>
      </div>
    </div>
    <!-- Tabs -->
    <div class="mt-2">
      <div
        v-if="profile.isPrivate && !profile.isFollowing"
        class="py-5"
        style="border-top: 1px solid grey;text-align: center;"
      >
        This account is private
      </div>
      <ProfileTabs v-else />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: profile, error } = await useApiFetch("/api/profile", {
  server: true, query: { username: route.params.username }
})
if (route.path !== "/profile") {
  useHead({ title: `${profile.value.name} (@${profile.value.username})` })
}
</script>

<style scoped>
.profile-link:not(:hover, :active) {
  color: #299ded;
  text-decoration: none;
}
</style>
