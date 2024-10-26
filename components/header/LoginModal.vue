<template>
  <v-dialog
    v-model="dialog"
    :width="mobile ? '' : '500'"
    :fullscreen="mobile"
    transition="scale-transition"
    scrim="black"
  >
    <template v-slot:activator="{ props }">
      <v-btn rounded="pill" class="mr-3" variant="outlined" color="light" v-bind="props">Login</v-btn>
    </template>
    <v-card class="py-2" :style="[mobile ? '' : 'border-radius: 18px']">
      <v-card-text class="text-h6 d-flex">
        Login
        <v-spacer></v-spacer>
        <v-btn v-show="mobile" icon="mdi-close" variant="text" @click="dialog = false" height="32" width="32"></v-btn>
      </v-card-text>
      <v-card-text class="pt-2 pb-5">
        <v-form ref="form" @submit.prevent="onSubmit" :readonly="loading">
          <v-text-field
            variant="outlined"
            v-model="username"
            label="Username"
            prefix="@"
            maxlength="32"
            @input="message=''"
            density="compact"
            class="mb-1"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="password"
            label="Password"
            :type="show ? 'text' : 'password'"
            @input="message=''"
            density="compact"
            class="mb-2"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show = !show"
          ></v-text-field>
          <div v-show="message.length" class="mb-5 text-error">{{ message }}</div>
          <v-btn color="primary" rounded="pill" block :loading="loading" type="submit">Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';

const dialog = ref(false)
const { mobile } = useDisplay()
const form = ref(null)
const username = ref("")
const password = ref("")
const show = ref(false)
const loading = ref(false)
const message = ref("")

async function onSubmit() {
  if (!username.value.match(/^\w{3,32}$/) || !password.value) {
    message.value = "Username or password incorrect"
    return false
  }
  loading.value = true
  const { data, error } = await useAuthFetch("/api/auth/token", {
    method: "POST",
    body: { username: username.value, password: password.value }
  })
  loading.value = false
  if (error.value) {
    message.value = "Oops, something went wrong. Please try again."
  } else {
    dialog.value = false
    await useNuxtApp().$auth.setUser(data.value)
    navigateTo("/profile")
  }
}
</script>
